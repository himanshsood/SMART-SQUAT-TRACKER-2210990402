# 🏋️ SMART SQUAT TRACKER - FitAssist

![FitAssist Banner](https://img.shields.io/badge/AI-Powered-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue) ![React](https://img.shields.io/badge/React-18.3-61dafb) ![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.22-orange)

An AI-powered smart squat counter that uses real-time pose detection to track your squats, provide instant form feedback, and calculate calories burned. Built with React, TypeScript, TensorFlow.js, and Shadcn/UI.

## ✨ Features

- 🎥 **Real-time Pose Detection** - Uses TensorFlow.js and webcam for accurate squat tracking
- 📊 **Live Rep Counting** - Automatically counts your squats with AI precision
- 🔥 **Calorie Tracking** - Calculates calories burned during your workout
- ⏱️ **Workout Timer** - Track your workout duration and rest periods
- 💬 **Form Feedback** - Get real-time feedback on your squat form
- 👤 **User Authentication** - Login/Register system for personalized tracking
- 🎨 **Modern UI** - Beautiful interface built with Shadcn/UI and Tailwind CSS
- 📱 **Responsive Design** - Works seamlessly across different screen sizes

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3.1 with TypeScript 5.8
- **Build Tool**: Vite 5.4.19 with SWC plugin
- **AI/ML**: TensorFlow.js 4.22.0 + Pose Detection Models 2.1.3
- **UI Components**: Shadcn/UI (Radix UI primitives)
- **Styling**: Tailwind CSS 3.4.17
- **Routing**: React Router DOM 6.30.1
- **State Management**: React Context API
- **Package Manager**: Bun
- **Testing**: Vitest 3.2.4 + Playwright 1.57.0

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Bun** (v1.0.0 or higher) - [Install Bun](https://bun.sh/docs/installation)
  ```bash
  # On macOS/Linux
  curl -fsSL https://bun.sh/install | bash
  
  # On Windows (PowerShell)
  powershell -c "irm bun.sh/install.ps1|iex"
  ```

- **Node.js** (v18.0.0 or higher) - [Download Node.js](https://nodejs.org/)

- **Webcam** - Required for pose detection functionality

- **Modern Browser** - Chrome, Firefox, Safari, or Edge (latest version recommended)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/himanshsood/SMART-SQUAT-TRACKER.git
cd SMART-SQUAT-TRACKER
```

### 2. Install Dependencies

This project uses **Bun** as the package manager. Install all dependencies:

```bash
bun install
```

> **Note**: If you encounter any issues with Bun, you can also use npm or yarn:
> ```bash
> npm install
> # or
> yarn install
> ```

### 3. Verify Installation

After installation, you should see:
- ✓ Dependencies installed successfully
- ✓ `node_modules` folder created
- ✓ Lock file (`bun.lockb`) present

## 🎯 Running the Application

### Development Mode

Start the development server with hot module replacement:

```bash
bun run dev
```

The application will start on **http://localhost:8080**

You should see output similar to:
```
  VITE v5.4.19  ready in XXX ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Building for Production

Create an optimized production build:

```bash
bun run build
```

The build output will be in the `dist/` folder.

### Preview Production Build

Preview the production build locally:

```bash
bun run preview
```

## 📱 Usage Guide

### First-Time Setup

1. **Open the Application**
   - Navigate to `http://localhost:8080` in your browser
   - You'll land on the Home page

2. **Allow Camera Access**
   - When you navigate to the Counter page (`/counter`), your browser will request camera permissions
   - Click "Allow" to enable pose detection

3. **Create an Account** (Optional)
   - Click "Login" or "Register" in the top navigation
   - Create an account to save your workout history

### Using the Squat Counter

1. **Navigate to Counter**
   - Click on "Start Workout" or navigate to `/counter`

2. **Position Yourself**
   - Stand 3-6 feet away from your webcam
   - Ensure your full body is visible in the frame
   - Stand in a well-lit area for best results

3. **Start Squatting**
   - The AI will automatically detect when you perform a squat
   - Rep count will increment automatically
   - Watch for real-time feedback on your form

4. **Monitor Your Stats**
   - **Rep Count**: Total squats completed
   - **Workout Time**: Duration of your session
   - **Calories**: Estimated calories burned (0.32 per squat)
   - **Feedback**: Real-time form tips

## 🎨 Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server on port 8080 |
| `bun run build` | Build for production |
| `bun run preview` | Preview production build |
| `bun run lint` | Run ESLint for code quality |
| `bun test` | Run Vitest unit tests |
| `bun run test:e2e` | Run Playwright E2E tests |

## 📁 Project Structure

```
SMART-SQUAT-TRACKER/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── TopBar.tsx      # Navigation bar
│   │   └── ui/             # Shadcn UI components
│   ├── pages/              # Application pages
│   │   ├── Home.tsx        # Landing page
│   │   ├── Counter.tsx     # Main squat tracking page
│   │   ├── Login.tsx       # Login page
│   │   ├── Register.tsx    # Registration page
│   │   └── NotFound.tsx    # 404 page
│   ├── context/            # React Context providers
│   │   └── AuthContext.tsx # Authentication context
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies
```

## 🔧 Configuration

### Port Configuration

The default development server port is **8080**. To change it, edit `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    port: 3000, // Change to your preferred port
  },
});
```

### Camera Settings

Camera resolution is set to 640x480 by default. To modify, edit `src/pages/Counter.tsx`:

```typescript
const stream = await navigator.mediaDevices.getUserMedia({
  video: { width: 640, height: 480 }, // Adjust as needed
  audio: false,
});
```

## 🐛 Troubleshooting

### Camera Not Working

**Issue**: Camera access denied or not detected

**Solutions**:
- Check browser permissions (Settings → Privacy → Camera)
- Ensure camera is not being used by another application
- Try a different browser (Chrome recommended for best WebGL support)
- Check if camera drivers are up to date

### TensorFlow.js Errors

**Issue**: "WebGL backend not available" or similar errors

**Solutions**:
- Ensure your browser supports WebGL (visit [webglreport.com](https://webglreport.com))
- Update your graphics drivers
- Try disabling hardware acceleration in browser settings, then re-enabling it
- Clear browser cache and reload

### Dependencies Installation Fails

**Issue**: Errors during `bun install`

**Solutions**:
```bash
# Clear Bun cache
rm -rf ~/.bun/install/cache

# Try installing again
bun install

# If still failing, use npm as fallback
npm install
```

### Port Already in Use

**Issue**: Port 8080 is already in use

**Solutions**:
```bash
# Find and kill process using port 8080 (Linux/Mac)
lsof -ti:8080 | xargs kill -9

# Or change the port in vite.config.ts
```

### Build Errors

**Issue**: TypeScript or build errors

**Solutions**:
```bash
# Clear build cache
rm -rf dist node_modules .vite

# Reinstall dependencies
bun install

# Try building again
bun run build
```

## 🎯 Browser Compatibility

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 90+ | ✅ Recommended - Best performance |
| Firefox | 88+ | ✅ Fully supported |
| Safari | 14+ | ✅ Supported (WebGL required) |
| Edge | 90+ | ✅ Fully supported |

## 🔒 Privacy & Security

- **Camera Access**: Your camera feed is processed locally in your browser
- **No Data Upload**: Video data never leaves your device
- **Local Processing**: All AI computations run on your device using TensorFlow.js
- **Secure**: No external servers process your workout data

## 🚀 Performance Tips

1. **Close Unnecessary Tabs**: TensorFlow.js is resource-intensive
2. **Good Lighting**: Improves pose detection accuracy
3. **Stable Camera**: Mount camera for consistent tracking
4. **Clear Background**: Reduces processing overhead
5. **Wear Contrasting Colors**: Helps with body detection

## 📚 Additional Resources

- [TensorFlow.js Documentation](https://www.tensorflow.org/js)
- [Pose Detection Guide](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Shadcn/UI Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Himanshu Sood**
- GitHub: [@himanshsood](https://github.com/himanshsood)

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev/) platform
- UI components from [Shadcn/UI](https://ui.shadcn.com/)
- Pose detection powered by [TensorFlow.js](https://www.tensorflow.org/js)

---

**Happy Squatting! 💪**

For issues and feature requests, please open an issue on [GitHub](https://github.com/himanshsood/SMART-SQUAT-TRACKER/issues).

