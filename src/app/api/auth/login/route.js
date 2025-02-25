import { NextResponse } from "next/server";
import axios from "axios";
import { serialize } from "cookie";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/authenticate`,
      {
        grant_type: "password",
        client_id: process.env.CLIENT_ID, // Do not expose in NEXT_PUBLIC_
        client_secret: process.env.CLIENT_SECRET,
        username,
        password
      },
      {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
      }
    );

    const { access_token, expires_in } = response.data;

    // Set HTTP-only cookie for security
    const cookie = serialize("token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "Strict",
      path: "/",
      maxAge: expires_in,
    });

    return new NextResponse(JSON.stringify({ message: "Login Successful" }), {
      status: 200,
      headers: { "Set-Cookie": cookie, "Content-Type": "application/json" },
    });

  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Invalid Credentials" }),
      { status: 401 }
    );
  }
}
