import { useRef, useState, useEffect } from "react";
import { Timer, Flame, Activity, ArrowLeft, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

function Counter() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectorRef = useRef<any>(null);
  const squatDownRef = useRef(false);
  const animateRef = useRef<number>();

  const [repCount, setRepCount] = useState(0);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [inRestMode, setInRestMode] = useState(false);
  const [feedback, setFeedback] = useState("Initializing camera...");
  const [isLoading, setIsLoading] = useState(true);
  const [prevRepCount, setPrevRepCount] = useState(0);

  const MIN_SCORE = 0.3;
  const CALORIES_PER_SQUAT = 0.32;

  // Track rep count changes for animation
  useEffect(() => {
    if (repCount !== prevRepCount) {
      setPrevRepCount(repCount);
    }
  }, [repCount, prevRepCount]);

  useEffect(() => {
    let mounted = true;

    async function setupCameraAndDetector() {
      try {
        const tf = await import("@tensorflow/tfjs");
        await import("@tensorflow/tfjs-backend-webgl");
        await tf.ready();
        await tf.setBackend("webgl");
      } catch (err) {
        console.error("Error initializing TensorFlow backend:", err);
      }

      const video = videoRef.current;
      if (!video || !mounted) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false,
        });
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
          }
          video.play();
        };
      } catch (err) {
        console.error("Error accessing video:", err);
        if (mounted) setFeedback("Camera access denied. Please allow camera access.");
        return;
      }

      try {
        const poseDetection = await import("@tensorflow-models/pose-detection");
        const detectorConfig = {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        };
        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          detectorConfig
        );
        if (mounted) {
          detectorRef.current = detector;
          setIsLoading(false);
          setFeedback("Ready! Start squatting.");
        }
      } catch (err) {
        console.error("Error loading detector:", err);
      }
    }

    setupCameraAndDetector();

    return () => {
      mounted = false;
      if (animateRef.current) cancelAnimationFrame(animateRef.current);
    };
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (!inRestMode) {
      timer = setInterval(() => setWorkoutTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [inRestMode]);

  useEffect(() => {
    if (inRestMode && restTime > 0) {
      const timer = setTimeout(() => setRestTime(restTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (inRestMode && restTime === 0) {
      setInRestMode(false);
    }
  }, [inRestMode, restTime]);

  useEffect(() => {
    async function detectPose() {
      if (detectorRef.current && videoRef.current) {
        try {
          const poses = await detectorRef.current.estimatePoses(videoRef.current);
          if (poses.length > 0) {
            const pose = poses[0];
            drawPose(pose);
            detectSquat(pose);
            provideFeedback(pose);
          }
        } catch (err) {
          // silently handle detection errors
        }
      }
      animateRef.current = requestAnimationFrame(detectPose);
    }
    detectPose();
    return () => {
      if (animateRef.current) cancelAnimationFrame(animateRef.current);
    };
  }, [inRestMode]);

  const drawPose = (pose: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pose.keypoints.forEach((kp: any) => {
      if (kp.score > MIN_SCORE) {
        ctx.beginPath();
        ctx.arc(kp.x, kp.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "hsl(24, 100%, 50%)";
        ctx.fill();
      }
    });
    drawSkeleton(pose.keypoints, ctx);
  };

  const drawSkeleton = (keypoints: any[], ctx: CanvasRenderingContext2D) => {
    const connections = [
      ["left_shoulder", "right_shoulder"],
      ["left_shoulder", "left_elbow"],
      ["left_elbow", "left_wrist"],
      ["right_shoulder", "right_elbow"],
      ["right_elbow", "right_wrist"],
      ["left_shoulder", "left_hip"],
      ["right_shoulder", "right_hip"],
      ["left_hip", "right_hip"],
      ["left_hip", "left_knee"],
      ["left_knee", "left_ankle"],
      ["right_hip", "right_knee"],
      ["right_knee", "right_ankle"],
    ];

    const keypointMap: Record<string, any> = {};
    keypoints.forEach((kp: any) => {
      keypointMap[kp.name || kp.part] = kp;
    });

    connections.forEach(([p1, p2]) => {
      const kp1 = keypointMap[p1];
      const kp2 = keypointMap[p2];
      if (kp1 && kp2 && kp1.score > MIN_SCORE && kp2.score > MIN_SCORE) {
        ctx.beginPath();
        ctx.moveTo(kp1.x, kp1.y);
        ctx.lineTo(kp2.x, kp2.y);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "hsl(142, 71%, 45%)";
        ctx.stroke();
      }
    });
  };

  const calculateAngle = (A: any, B: any, C: any) => {
    const AB = { x: A.x - B.x, y: A.y - B.y };
    const CB = { x: C.x - B.x, y: C.y - B.y };
    const dot = AB.x * CB.x + AB.y * CB.y;
    const magAB = Math.hypot(AB.x, AB.y);
    const magCB = Math.hypot(CB.x, CB.y);
    const angleRad = Math.acos(dot / (magAB * magCB));
    return angleRad * (180 / Math.PI);
  };

  const detectSquat = (pose: any) => {
    const leftHip = pose.keypoints.find((kp: any) => (kp.name || kp.part) === "left_hip");
    const leftKnee = pose.keypoints.find((kp: any) => (kp.name || kp.part) === "left_knee");
    const leftAnkle = pose.keypoints.find((kp: any) => (kp.name || kp.part) === "left_ankle");

    if (
      leftHip && leftKnee && leftAnkle &&
      leftHip.score > MIN_SCORE &&
      leftKnee.score > MIN_SCORE &&
      leftAnkle.score > MIN_SCORE
    ) {
      const angle = calculateAngle(leftHip, leftKnee, leftAnkle);
      const downThreshold = 100;
      const upThreshold = 140;

      if (angle < downThreshold && !squatDownRef.current) {
        squatDownRef.current = true;
      }

      if (angle > upThreshold && squatDownRef.current) {
        setRepCount((prev) => prev + 1);
        squatDownRef.current = false;
      }
    }
  };

  const provideFeedback = (pose: any) => {
    const leftShoulder = pose.keypoints.find((kp: any) => kp.name === "left_shoulder");
    const leftHip = pose.keypoints.find((kp: any) => kp.name === "left_hip");
    const leftKnee = pose.keypoints.find((kp: any) => kp.name === "left_knee");

    if (!leftShoulder || !leftHip || !leftKnee) return;

    if (leftHip.y < leftShoulder.y) {
      setFeedback("⚠️ Keep your back straight");
    } else {
      setFeedback("✅ Great form! Keep going!");
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleReset = () => {
    setRepCount(0);
    setWorkoutTime(0);
    setRestTime(0);
    setInRestMode(false);
    squatDownRef.current = false;
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 opacity-0 animate-fade-up">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Squat Counter
          </h1>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition-all duration-200 hover:bg-secondary/80 active:scale-[0.97]"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </button>
        </div>

        {/* Stats Grid */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 opacity-0 animate-fade-up"
          style={{ animationDelay: "150ms" }}
        >
          <div className="stat-card text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
              <Activity className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Reps</span>
            </div>
            <p
              key={repCount}
              className="font-display text-5xl font-bold text-primary tabular-nums animate-count-pop"
            >
              {repCount}
            </p>
          </div>

          <div className="stat-card text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
              <Timer className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Time</span>
            </div>
            <p className="font-display text-5xl font-bold text-foreground tabular-nums">
              {formatTime(workoutTime)}
            </p>
          </div>

          <div className="stat-card text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
              <Flame className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Calories</span>
            </div>
            <p className="font-display text-5xl font-bold text-foreground tabular-nums">
              {(repCount * CALORIES_PER_SQUAT).toFixed(1)}
            </p>
          </div>

          <div className="stat-card text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Feedback</span>
            </div>
            <p className="text-lg font-medium text-foreground leading-snug">
              {inRestMode ? `Rest: ${restTime}s` : feedback}
            </p>
          </div>
        </div>

        {/* Video Feed */}
        <div
          className="relative mx-auto max-w-[640px] rounded-2xl overflow-hidden border border-border shadow-2xl opacity-0 animate-fade-up"
          style={{ animationDelay: "300ms" }}
        >
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-card">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mb-4" />
              <p className="text-sm text-muted-foreground">Loading pose detection model...</p>
            </div>
          )}
          <div className="relative aspect-[4/3] bg-card">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              playsInline
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Counter;
