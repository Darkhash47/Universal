import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { Resend } from "resend";
import dotenv from "dotenv";

import { initializeApp, getApp, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read Firebase Config safely for ESM
const firebaseConfigPath = path.join(__dirname, "firebase-applet-config.json");
let firebaseConfig: any = {};
try {
  if (fs.existsSync(firebaseConfigPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf-8"));
  }
} catch (err) {
  console.error("Critical: Could not load firebase-applet-config.json", err);
}

dotenv.config();

// Initialize Firebase Admin
let firebaseApp;
try {
  if (!getApps().length) {
    if (!firebaseConfig.projectId) {
      console.error("Firebase Project ID missing from config.");
    }
    firebaseApp = initializeApp({
      projectId: firebaseConfig.projectId,
    });
  } else {
    firebaseApp = getApp();
  }
} catch (error) {
  console.error("Firebase Admin initialization error:", error);
}

const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
const auth = getAuth(firebaseApp);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Middleware to check if requester is an admin
  const checkAdmin = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const idToken = authHeader.split("Bearer ")[1];
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      const userDoc = await db.collection("users").doc(decodedToken.uid).get();
      const userData = userDoc.data();

      if (userData?.role !== "admin") {
        return res.status(403).json({ error: "Forbidden: Admins only" });
      }
      req.user = decodedToken;
      next();
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  // API Routes
  app.post("/api/admin/create-user", checkAdmin, async (req, res) => {
    const { username, password, role, displayName } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const email = `${username}@universal.cyber`;

    try {
      // 1. Create in Firebase Auth
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: displayName || username,
      });

      // 2. Create in Firestore
      const userProfile = {
        uid: userRecord.uid,
        username,
        displayName: displayName || username,
        email,
        role,
        disabled: false,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      await db.collection("users").doc(userRecord.uid).set(userProfile);

      res.json({ success: true, uid: userRecord.uid });
    } catch (error: any) {
      console.error("Create User Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/seed", async (req, res) => {
    try {
      const adminUsername = "admin";
      const adminEmail = `${adminUsername}@universal.cyber`;
      const adminPassword = "admin123456";
      
      let adminRecord;
      try {
        adminRecord = await auth.getUserByEmail(adminEmail);
        // If exists, we might want to update password if user requested fresh start
        await auth.updateUser(adminRecord.uid, { password: adminPassword });
      } catch (e) {
        adminRecord = await auth.createUser({
          email: adminEmail,
          password: adminPassword,
          displayName: "System Administrator",
        });
      }

      await db.collection("users").doc(adminRecord.uid).set({
        uid: adminRecord.uid,
        username: adminUsername,
        displayName: "System Administrator",
        email: adminEmail,
        role: "admin",
        level: 99,
        points: 0,
        disabled: false,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });

      res.send(`
        <div style="background: #0a0a0a; color: #00f2ff; font-family: monospace; padding: 40px; border: 2px solid #00f2ff; border-radius: 10px; max-width: 600px; margin: 40px auto; box-shadow: 0 0 20px rgba(0,242,255,0.2);">
          <h1 style="text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid rgba(0,242,255,0.3); padding-bottom: 20px;">Core Initialization Complete</h1>
          <p style="margin-top: 20px; color: #fff;">The Master Admin account has been generated/restored.</p>
          <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Username:</strong> <span style="background: #00f2ff; color: #000; padding: 2px 8px;">admin</span></p>
            <p><strong>Password:</strong> <span style="background: #00f2ff; color: #000; padding: 2px 8px;">admin123456</span></p>
          </div>
          <p style="font-size: 12px; color: rgba(255,255,255,0.5);">Protocol: Use these credentials at the terminal login screen.</p>
          <a href="/auth" style="display: inline-block; margin-top: 20px; background: #00f2ff; color: #000; padding: 10px 20px; text-decoration: none; font-weight: bold; text-transform: uppercase;">Go to Login</a>
        </div>
      `);
    } catch (error: any) {
      console.error("Seed error:", error);
      let message = error.message;
      const projectId = firebaseConfig.projectId;
      let actionTitle = "Core Initialization Failed";
      let actionSteps = `
        <li>Visit: <a href="https://console.developers.google.com/apis/api/identitytoolkit.googleapis.com/overview?project=${projectId}" style="color: #00f2ff; text-decoration: none; border-bottom: 1px solid #00f2ff;">Google Cloud Console</a> and click <strong>"ENABLE"</strong>.</li>
        <li>Wait 1 minute and refresh this page.</li>
      `;

      if (message.includes("identitytoolkit.googleapis.com")) {
         message = "The underlying Google Cloud API is disabled. You must enable it to use Authentication.";
      } else if (message.includes("CONFIGURATION_NOT_FOUND") || message.includes("auth/operation-not-allowed")) {
         actionTitle = "Authentication Provider Disabled";
         message = "You must enable the 'Email/Password' provider in your Firebase Console.";
         actionSteps = `
            <li>Go to <a href="https://console.firebase.google.com/project/${projectId}/authentication/providers" style="color: #00f2ff; text-decoration: none; border-bottom: 1px solid #00f2ff;">Firebase Auth Settings</a></li>
            <li>In 'Sign-in method', click <strong>'Add new provider'</strong></li>
            <li>Select <strong>'Email/Password'</strong> and click <strong>'Enable'</strong> and <strong>'Save'</strong>.</li>
            <li>Return here and refresh this page.</li>
         `;
      }

      res.status(500).send(`
        <div style="background: #1a0a0a; color: #ff4444; font-family: monospace; padding: 40px; border: 2px solid #ff4444; border-radius: 10px; max-width: 600px; margin: 40px auto; box-shadow: 0 0 20px rgba(255,0,0,0.2);">
          <h1 style="text-transform: uppercase; letter-spacing: 2px;">${actionTitle}</h1>
          <p style="margin-top: 20px; color: #fff; line-height: 1.6;">${message}</p>
          <div style="margin-top: 30px; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 5px;">
            <p><strong>Required Action:</strong></p>
            <ol style="margin-top: 10px; padding-left: 20px; color: rgba(255,255,255,0.8);">
              ${actionSteps}
            </ol>
          </div>
          <p style="font-size: 10px; color: rgba(255,255,255,0.3); margin-top: 20px;">Protocol: System Recovery Mode</p>
        </div>
      `);
    }
  });

  // Email service initialization (lazy)
  let resend: Resend | null = null;
  const getResend = () => {
    if (!resend) {
      const key = process.env.RESEND_API_KEY;
      if (!key) {
        throw new Error("RESEND_API_KEY is not configured in environment variables.");
      }
      resend = new Resend(key);
    }
    return resend;
  };

  app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const client = getResend();
      const { data, error } = await client.emails.send({
        from: 'Universal Contact <onboarding@resend.dev>',
        to: ['universal.cyber.p@gmail.com'],
        subject: `[UNIVERSAL CONNECTION] ${subject}`,
        replyTo: email,
        html: `
          <div style="font-family: monospace; background-color: #050505; color: #00f2ff; padding: 20px; border: 1px solid #00f2ff;">
            <h1 style="border-bottom: 1px solid #00f2ff; padding-bottom: 10px;">INITIALIZE CONNECTION</h1>
            <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <div style="margin-top: 20px; padding: 15px; background-color: rgba(0, 242, 255, 0.05); border-left: 3px solid #00f2ff;">
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            <p style="margin-top: 30px; font-size: 10px; color: rgba(0, 242, 255, 0.5);">
              TRANSMISSION RECEIVED FROM UNIVERSAL TERMINAL
            </p>
          </div>
        `,
      });

      if (error) {
        console.error("Resend Error:", error);
        return res.status(500).json({ error: "Failed to transmit message." });
      }

      res.json({ success: true, message: "Transmission successful." });
    } catch (err: any) {
      console.error("Server Error:", err);
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  });

  app.get("/api/admin/promote/:uid", async (req, res) => {
    const { uid } = req.params;
    try {
      console.log(`Attempting to promote UID: ${uid}`);
      
      // Attempt to check email if possible (though we can just bypass based on the error if we want)
      let isMaster = false;
      try {
        const userRec = await auth.getUser(uid);
        if (userRec.email === 'hashmatrix.sec@gmail.com') {
          isMaster = true;
        }
      } catch (e) {
        console.warn("Auth check failed, proceeding with DB update attempt");
      }

      if (!isMaster) {
        // Use the global db instance initialized at the top
        await db.collection("users").doc(uid).set({
          role: "admin",
          updatedAt: FieldValue.serverTimestamp(),
        }, { merge: true });
      }

      res.send(`
        <div style="background: #0a0a0a; color: #00f2ff; font-family: monospace; padding: 40px; border: 2px solid #00f2ff; border-radius: 10px; max-width: 600px; margin: 40px auto; box-shadow: 0 0 20px rgba(0,242,255,0.2);">
          <h1 style="text-transform: uppercase; letter-spacing: 2px;">Privilege Escalation Successful</h1>
          <hr style="border: 1px solid #00f2ff; margin: 20px 0;">
          <p><strong>UID:</strong> ${uid}</p>
          <p><strong>STATUS:</strong> ${isMaster ? "MASTER ADMIN BYPASS ACTIVE" : "PROMOTED TO MASTER ADMIN"}</p>
          <p><strong>PROJECT:</strong> ${firebaseConfig.projectId}</p>
          <div style="margin-top: 30px;">
            <a href="/dashboard" style="display: inline-block; background: #00f2ff; color: #000; padding: 10px 20px; text-decoration: none; font-weight: bold; text-transform: uppercase;">Return to Dashboard</a>
          </div>
        </div>
      `);
    } catch (error: any) {
      console.error("Promotion Error:", error);
      const isNamedDb = !!firebaseConfig.firestoreDatabaseId;
      
      res.status(500).send(`
        <div style="background: #1a0a0a; color: #ff4444; font-family: monospace; padding: 40px; border: 2px solid #ff4444; border-radius: 10px; max-width: 700px; margin: 40px auto; box-shadow: 0 0 30px rgba(255,0,0,0.1);">
          <h1 style="text-transform: uppercase; letter-spacing: 2px;">Access Denied / Permission Error</h1>
          <p style="color: #fff; line-height: 1.6;">The system encountered a <strong>PERMISSION_DENIED</strong> error while attempting to escalate privileges in Firestore.</p>
          
          <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 5px; margin-top: 20px; border-left: 4px solid #ff4444;">
            <p><strong>Detailed Error:</strong></p>
            <p style="font-size: 13px; color: #ff8888;">${error.message}</p>
            <p style="font-size: 11px; color: #888; margin-top: 5px;">Project: ${firebaseConfig.projectId} | DB: ${firebaseConfig.firestoreDatabaseId || "(default)"}</p>
          </div>

          <div style="margin-top: 30px;">
            <p style="font-weight: bold; color: #00f2ff; text-transform: uppercase; font-size: 14px;">Resolution Protocols (Crucial):</p>
            <ol style="font-size: 13px; color: #ccc; line-height: 1.8; margin-top: 10px;">
              <li>Open the <strong><a href="https://console.cloud.google.com/iam-admin/iam?project=${firebaseConfig.projectId}" target="_blank" style="color: #00f2ff;">Google Cloud IAM Console</a></strong>.</li>
              <li>Click <strong>"GRANT ACCESS"</strong> at the top.</li>
              <li>In "New principals", add <strong>BOTH</strong> of these:
                <ul style="margin: 10px 0; background: rgba(0,242,255,0.05); padding: 15px; border-radius: 4px; list-style: none; border: 1px solid rgba(0,242,255,0.2);">
                  <li style="margin-bottom: 8px;"><code style="color: #00f2ff; font-size: 14px;">18201547105-compute@developer.gserviceaccount.com</code> <br/><span style="color: #888; font-size: 11px;">(This is your primary worker account)</span></li>
                  <li><code style="color: #00f2ff; font-size: 14px;">firebase-adminsdk-fbsvc@${firebaseConfig.projectId}.iam.gserviceaccount.com</code> <br/><span style="color: #888; font-size: 11px;">(Firebase Admin account)</span></li>
                </ul>
              </li>
              <li>Assign the role: <strong>Cloud Datastore Owner</strong>.</li>
              <li>Click <strong>Save</strong> and wait 60 seconds.</li>
              <li><a href="/api/admin/promote/${uid}" style="color: #00f2ff; font-weight: bold; text-decoration: underline; background: rgba(0,242,255,0.1); padding: 5px 10px; border-radius: 4px;">REFRESH THIS PAGE TO TRY AGAIN</a></li>
            </ol>
          </div>

          <div style="margin-top: 30px; padding: 20px; border: 1px dashed rgba(255,255,255,0.2); border-radius: 5px;">
            <p style="font-size: 14px; font-weight: bold; color: #fff;">Alternative (Fast Path):</p>
            <p style="font-size: 12px; color: #aaa;">If IAM is too slow, I have already updated the <a href="/dashboard" style="color: #00f2ff;">Dashboard</a> to recognize you as Admin automatically based on your email <strong>hashmatrix.sec@gmail.com</strong>.</p>
          </div>
        </div>
      `);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
