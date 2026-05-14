import express from "express";

export const profileRouter = express.Router();

import { getProfile, updateProfile, deleteProfile } from "../GlobalLogic/profileRouter.js";

profileRouter.get("/profile", getProfile);
profileRouter.put("/profile", updateProfile);
profileRouter.delete("/profile", deleteProfile);