import express from "express";
import { Request, Response } from "express";

import {User} from "../db";

const router = express.Router();

router.get("/register", async (_request: Request, response: Response) => {
  response.render("auth/register");
});

router.post("/register", async (request: Request, response: Response) => {
  const { email, password, firstName, lastName, userName } = request.body;

  try {
    const user = await User.register(email, password, firstName, lastName, userName);

    // @ts-ignore
    response.json({user});
  } catch (error) {
    console.error("Error registering user:", error);

    response.render("auth/register", {
      error: "Invalid credentials.",
      email,
      firstName,
      lastName,
      userName
    });
  }
});


router.get("/login", async (_request: Request, response: Response) => {
    response.render("auth/login");
  });

  router.post("/login", async (request: Request, response: Response) => {
    const { username, password } = request.body;
  
    try {
      const user = await User.login(username, password);
  
      // @ts-ignore
      response.json({user});
    } catch (error) {
      console.error("Error logging in user:", error);
  
      response.render("auth/login", {
        error: "Invalid credentials.",
        username, // so the form can re-fill this on error
      });
    }
  });
  

  export default router;