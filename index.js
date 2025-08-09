const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const port = process.env.port || 3000;
const cookieParser = require("cookie-parser");
const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173","https://group-study00.netlify.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const verifyToken = (req, res, next) => {
  const token = req?.cookies?.token;
  console.log("verify token is here :   ", token);

  if (!token) {
    return res.status(401).send({ massage: "unauthorized access to the server" });
  }
  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: " Unauthorized access" });
    }
    req.decoded = decoded;
    next();
  });
};

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster002.1tiyhof.mongodb.net/?retryWrites=true&w=majority&appName=Cluster002`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const assignmentCollection = client.db("studyDB").collection("assignment");
    const submissionCollection = client
      .db("submissionDB")
      .collection("submission");

    app.post("/jwt", async (req, res) => {
      const { email } = req.body;
      const user = { email };
      const token = jwt.sign(user, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "1d",
      });
// I have to write Below code for production
    res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', 
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',

            })
      res.send({ sucess: true });
    });

    app.get("/assignments/search", async (req, res) => {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ message: "Search query is required" });
      }
      try {
        const assignments = await assignmentCollection
          .find({
            $or: [
              { title: { $regex: q, $options: "i" } },
              { description: { $regex: q, $options: "i" } },
            ],
          })
          .toArray();
        res.status(200).json(assignments);
      } catch (error) {
        console.error("Failed to search assignments:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });
    app.get("/assignments/difficulty/:level", async (req, res) => {
      const { level } = req.params;
      try {
        const assignments = await assignmentCollection
          .find({ difficulty: level })
          .toArray();
        res.status(200).json(assignments);
      } catch (error) {
        console.error("Failed to fetch assignments by difficulty:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.patch("/submissions/:id", async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;
      try {
        const result = await submissionCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );
        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Submission not found" });
        }
        res.status(200).json({ message: "Submission updated successfully" });
      } catch (error) {
        console.error("Failed to update submission:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.get("/submissions/pending/:email", verifyToken, async (req, res) => {
      const { email } = req.params;
      // Only allow access if the email matches the token's decoded email
      if (email !== req.decoded.email) {
        return res.status(403).json({ message: "Forbidden access" });
      }
      try {
        const pendingSubmissions = await submissionCollection
          .find({ status: "pending", submittedBy: email })
          .toArray();
        res.status(200).json(pendingSubmissions);
      } catch (error) {
        console.error("Failed to fetch pending submissions:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.post("/submissions", async (req, res) => {
      try {
        const newSubmission = req.body;
        if (!newSubmission || Object.keys(newSubmission).length === 0) {
          return res
            .status(400)
            .json({ message: "Submission data is required" });
        }

        // Check for existing submission with same assignmentId and submittedBy
        const existing = await submissionCollection.findOne({
          assignmentId: newSubmission.assignmentId,
          submittedBy: newSubmission.submittedBy,
        });

        if (existing) {
          return res
            .status(409)
            .json({ message: "Assignment is already taken" });
        }

        const result = await submissionCollection.insertOne(newSubmission);
        res.status(201).json({
          message: "Submission created successfully",
          submissionId: result.insertedId,
        });
      } catch (error) {
        console.error("Failed to create submission:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });
    app.get("/submissions/by-email/:email", verifyToken, async (req, res) => {
      const { email } = req.params;
      if (email !== req.decoded.email) {
        return res.status(403).send({ massage: " Forbidden access" });
      }

      try {
        const submissions = await submissionCollection
          .find({ submittedBy: email })
          .toArray();
        res.status(200).json(submissions);
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.get("/assignments", async (req, res) => {
      try {
        const assignments = await assignmentCollection.find({}).toArray();
        res.status(200).json(assignments);
      } catch (error) {
        console.error("Failed to fetch assignments:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.put("/assignments/:id",verifyToken, async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedAssignment = req.body;
      console.log(updatedAssignment);
      const updatedDoc = {
        $set: updatedAssignment,
      };

      const result = await assignmentCollection.updateOne(
        filter,
        updatedDoc,
        options
      );

      res.send(result);
    });

    app.delete("/assignments/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const result = await assignmentCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Assignment not found" });
        }
        res.status(200).json({ message: "Assignment deleted successfully" });
      } catch (error) {
        console.error("Failed to delete assignment:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.post("/assignments", async (req, res) => {
      try {
        const newAssignment = req.body;
        if (!newAssignment || Object.keys(newAssignment).length === 0) {
          return res
            .status(400)
            .json({ message: "Assignment data is required" });
        }
        const result = await assignmentCollection.insertOne(newAssignment);
        res.status(201).json({
          message: "Assignment created successfully",
          assignmentId: result.insertedId,
        });
      } catch (error) {
        console.error("Failed to create assignment:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.get("/assignments/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const assignment = await assignmentCollection.findOne({
          _id: new ObjectId(id),
        });
        if (!assignment) {
          return res.status(404).json({ message: "Assignment not found" });
        }
        res.status(200).json(assignment);
      } catch (error) {
        console.error("Failed to fetch assignment:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Group study api ...");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
