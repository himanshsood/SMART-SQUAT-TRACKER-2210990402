import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, Activity, Flame, Timer } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-background/80" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="mx-auto max-w-3xl">
            <p
              className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary opacity-0 animate-fade-up"
            >
              AI-Powered Fitness
            </p>
            <h1
              className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-foreground opacity-0 animate-fade-up"
              style={{ animationDelay: "100ms", lineHeight: "0.95" }}
            >
              FITASSIST
            </h1>
            <p
              className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto opacity-0 animate-fade-up"
              style={{ animationDelay: "200ms" }}
            >
              Track your squats in real-time with AI pose detection. 
              Get instant form feedback and calorie tracking.
            </p>
            <div
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-up"
              style={{ animationDelay: "300ms" }}
            >
              <Link
                to="/counter"
                className="group flex items-center gap-3 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:shadow-primary/30 hover:shadow-2xl active:scale-[0.97] animate-pulse-glow"
              >
                Start Workout
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              {/* {!user && (
                <Link
                  to="/register"
                  className="rounded-xl border border-border px-8 py-4 text-lg font-medium text-foreground transition-all duration-200 hover:bg-secondary active:scale-[0.97]"
                >
                  Create Account
                </Link>
              )} */}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <h2
            className="font-display text-3xl font-bold text-center text-foreground mb-16 opacity-0 animate-fade-up"
          >
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Activity,
                title: "Pose Detection",
                desc: "MoveNet AI analyzes your body position in real-time through your webcam.",
                delay: "100ms",
              },
              {
                icon: Flame,
                title: "Calorie Tracking",
                desc: "Automatically estimates calories burned based on your squat count.",
                delay: "200ms",
              },
              {
                icon: Timer,
                title: "Form Feedback",
                desc: "Get instant feedback on your squat form to prevent injuries.",
                delay: "300ms",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="stat-card text-center opacity-0 animate-fade-up"
                style={{ animationDelay: feature.delay }}
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
