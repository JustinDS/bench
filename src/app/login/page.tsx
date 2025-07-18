import { login, signup, signupWithGoogle } from "./actions";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl m-auto lg:my-50">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
      <form>
        <div className="space-y-4">
          <input
            id="email"
            name="email"
            required
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            formAction={login}
            className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition cursor-pointer"
          >
            Login
          </button>
          <button
            formAction={signup}
            className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition cursor-pointer"
          >
            Sign up
          </button>
        </div>
      </form>
      <div className="my-6 text-center text-gray-400">or</div>

      <form>
        <button
          formAction={signupWithGoogle}
          className="w-full border py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path
              d="M44.5 20H24v8.5h11.9C34.4 33.7 29.8 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 6 .9 8.3 2.7l6.2-6.2C34.5 4.5 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.3-.1-2.7-.5-4z"
              fill="#2a2a2a"
            />
          </svg>
          <span>Sign in with Google</span>
        </button>
      </form>
    </div>
  );
}
