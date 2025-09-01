import ParcelLogin from "@/assets/images/parcelo.png";
import { Link } from "react-router";
import { LoginForm } from "@/components/modules/Authentication/LoginForm";
import Logo from "@/assets/icons/Logo.svg";

export default function Login() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start font-story">
          <Link to="/" className="text-chart-2 hover:text-foreground/90 ml-4">
            <div className="flex items-center justify-baseline space-x-6">
              <img src={Logo} alt="Parcelo Logo" className="h-8 w-auto" />
              <p className="text-5xl font-bold">Parcelo</p>
            </div>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src={ParcelLogin}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8]"
        />
      </div>
    </div>
  );
}
