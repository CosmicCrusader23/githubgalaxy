# GitHub Galaxy - Interactive 3D GitHub Profile Visualization

## 🌌 Overview

GitHub Galaxy transforms a GitHub user's profile into a mesmerizing spinning solar system using React Three Fiber. Each repository becomes an orbiting planet, with open issues appearing as moons around those planets.

---

## 📊 Data Structure (TypeScript Interfaces)

### GitHub API Types

```typescript
// User Profile Data
interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;      // Mapped to sun texture
  followers: number;       // Determines sun size
  public_repos: number;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

// Repository Data
interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;        // Opens on planet click
  stargazers_count: number; // Determines planet size
  open_issues_count: number; // Creates moons
  description: string | null;
  language: string | null;
  topics: string[];
}

// Internal 3D Data
interface PlanetData {
  repo: GitHubRepo;
  orbitRadius: number;     // Distance from sun
  orbitSpeed: number;      // Orbit velocity
  orbitPhase: number;      // Starting angle
  size: number;            // Visual radius
  color: string;           // Procedural HSL
}

interface MoonData {
  orbitRadius: number;     // Distance from planet
  orbitSpeed: number;      // Moon velocity
  orbitPhase: number;      // Starting angle
  size: number;            // Visual radius
}
```

---

## 🧮 Orbit Math Logic

### Planet Orbits (Sun → Planets)

**Mathematical Formula:**
```
x = R × cos(θ₀ + t × ω)
z = R × sin(θ₀ + t × ω)

Where:
- R = orbitRadius (distance from sun)
- θ₀ = orbitPhase (starting position)
- t = time (clock.getElapsedTime())
- ω = orbitSpeed (angular velocity)
```

**Implementation in Code:**
```typescript
useFrame((state) => {
  const time = state.clock.getElapsedTime();
  const angle = orbitPhase + time * orbitSpeed;

  meshRef.current.position.x = Math.cos(angle) * orbitRadius;
  meshRef.current.position.z = Math.sin(angle) * orbitRadius;
});
```

**Orbit Distribution Strategy:**
- Planets grouped into orbital bands (3-4 per band)
- Base radius starts at 4 units
- Each band adds 2 units of distance
- Within a band, spacing of 0.5 units
- Closer planets orbit faster: `speed = 0.2 + 0.3 / (bandIndex + 1)`

### Moon Orbits (Planet → Moons)

**Same math, relative to parent planet:**
```typescript
useFrame((state) => {
  const time = state.clock.getElapsedTime();
  const angle = orbitPhase + time * orbitSpeed;

  meshRef.current.position.x = Math.cos(angle) * orbitRadius;
  meshRef.current.position.z = Math.sin(angle) * orbitRadius;
});
```

**Moon Configuration:**
- Up to 5 moons per planet (limited by open_issues_count)
- Orbit radius: 1.8-3.8 units from planet surface
- Speed range: 1.5-3.0 (faster than planets)

---

## 🎨 Visual Mapping

### The Sun (User Profile)

**Location:** `[0, 0, 0]` - Center of the solar system

**Size Calculation:**
```typescript
const logFollowers = Math.log10(Math.max(user.followers, 1));
const sunSize = 1.5 + Math.min(logFollowers * 0.3, 1.5);
// Range: 1.5 - 3.0 units
```

**Lighting:**
- PointLight inside (intensity: 2, distance: 100)
- Color: Gold (#FFD700)
- Emissive: Orange (#FFA500) at 50% intensity
- Secondary glow sphere for atmosphere effect

### Planets (Repositories)

**Size Calculation:**
```typescript
const logStars = Math.log10(Math.max(repo.stargazers_count, 1));
const planetSize = 0.3 + Math.min(logStars * 0.2, 0.9);
// Range: 0.3 - 1.2 units
```

**Color Generation:**
```typescript
const hue = (index * (360 / total)) % 360;  // Even distribution
const saturation = 65 + Math.random() * 20; // 65-85%
const lightness = 45 + Math.random() * 15;  // 45-60%
const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
```

**Visual Features:**
- Material: meshStandardMaterial
- Roughness: 0.6, Metalness: 0.4
- Hover effect: Scale to 1.3x + emissive glow
- Orbit path: Subtle ring at orbit radius

### Moons (Open Issues)

**Configuration:**
- Count: `Math.min(repo.open_issues_count, 5)`
- Size: Fixed at 0.08 units
- Color: Light gray (#AAAAAA)
- Roughness: 0.8, Metalness: 0.2

---

## 🏗️ Component Architecture

### Scene.tsx (Main 3D Container)

```typescript
export function Scene({ data }: SceneProps) {
  return (
    <Canvas camera={{ position: [0, 15, 20], fov: 60 }} shadows>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      
      {/* Environment */}
      <Stars radius={300} depth={50} count={5000} fade />
      <Environment preset="sunset" />
      
      {/* Objects */}
      <Sun user={data.user} />
      {data.planets.map(p => <Planet key={p.repo.id} planetData={p} />)}
      
      {/* Controls */}
      <OrbitControls minDistance={5} maxDistance={50} />
    </Canvas>
  );
}
```

### Sun.tsx (User Avatar)

```typescript
export function Sun({ user }: SunProps) {
  const sunSize = calculateSunSize(user.followers);
  
  useFrame(() => {
    meshRef.current.rotation.y += 0.002; // Slow rotation
  });

  return (
    <group>
      <Sphere args={[sunSize, 32, 32]}>
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFA500"
          emissiveIntensity={0.5}
        />
      </Sphere>
      <pointLight intensity={2} distance={100} />
    </group>
  );
}
```

### Planet.tsx (Repository Planet)

```typescript
export function Planet({ planetData }: PlanetProps) {
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const angle = orbitPhase + time * orbitSpeed;
    
    groupRef.current.position.x = Math.cos(angle) * orbitRadius;
    groupRef.current.position.z = Math.sin(angle) * orbitRadius;
    
    meshRef.current.scale.lerp(
      new THREE.Vector3(hovered ? 1.3 : 1, hovered ? 1.3 : 1, hovered ? 1.3 : 1),
      0.1
    );
  });

  return (
    <group ref={groupRef}>
      <Sphere
        onClick={() => window.open(repo.html_url, '_blank')}
        onPointerOver={() => { setHovered(true); }}
      >
        <meshStandardMaterial color={color} />
      </Sphere>
      {moons.map(m => <Moon key={m.id} {...m} />)}
    </group>
  );
}
```

### Moon.tsx (Issue Moons)

```typescript
export function Moon({ orbitRadius, orbitSpeed, orbitPhase, size }: MoonProps) {
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const angle = orbitPhase + time * orbitSpeed;
    
    meshRef.current.position.x = Math.cos(angle) * orbitRadius;
    meshRef.current.position.z = Math.sin(angle) * orbitRadius;
  });

  return <Sphere args={[size, 16, 16]} />;
}
```

---

## 🔧 API Handling

### Custom Hook: useGitHubData

```typescript
export function useGitHubData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGitHubData = async (username: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/github?username=${username}`);
      const result = await response.json();
      const planets = processRepos(result.repos);
      setData({ user: result.user, planets });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchGitHubData };
}
```

### GitHub API Route (Backend)

```typescript
// src/app/api/github/route.ts
export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username');
  
  // Fetch user
  const userResponse = await fetch(`https://api.github.com/users/${username}`);
  const userData = await userResponse.json();
  
  // Fetch repos
  const reposResponse = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
  );
  const reposData = await reposResponse.json();
  
  return NextResponse.json({ user: userData, repos: reposData });
}
```

### Rate Limit Handling

**GitHub API Limits:**
- Without token: 60 requests/hour
- With token: 5,000 requests/hour

**Error Handling:**
```typescript
if (userResponse.status === 403) {
  return NextResponse.json(
    { error: 'Rate limit exceeded. Please try again later.' },
    { status: 403 }
  );
}
```

**Tip:** Add `GITHUB_TOKEN` to `.env` for higher limits:
```env
GITHUB_TOKEN=ghp_your_token_here
```

---

## 🎮 Key Features

### 1. Atmosphere & Background
- **Stars**: 5000 procedurally placed stars with fade effect
- **Lighting**: Ambient + Directional + Point light (in sun)
- **Environment**: Sunset preset for realistic reflections

### 2. Camera Controls (OrbitControls)
- **Rotate**: Click and drag
- **Zoom**: Scroll wheel
- **Pan**: Right-click and drag
- **Limits**: Min distance 5, Max distance 50

### 3. Interactions
- **Planet Click**: Opens repository in new tab
- **Hover**: Planet scales up and glows
- **Cursor**: Changes to pointer on interactive elements

### 4. UI Features
- Search input with GitHub icon
- User info card with avatar
- Legend explaining visual mapping
- Loading overlay with skeletons
- Error display with alerts
- Responsive design

---

## 📁 File Structure

```
src/
├── app/
│   ├── page.tsx              # Main UI + Search
│   ├── api/
│   │   └── github/
│   │       └── route.ts      # GitHub API backend
│   └── layout.tsx            # Root layout
├── components/
│   ├── 3d/
│   │   ├── Scene.tsx         # Canvas + Controls
│   │   ├── Sun.tsx           # User sphere
│   │   ├── Planet.tsx        # Repo planets
│   │   └── Moon.tsx          # Issue moons
│   └── ui/                   # shadcn/ui
├── hooks/
│   ├── use-github-data.ts    # Data fetch hook
│   └── use-toast.ts          # Toast notifications
├── types/
│   └── github.ts             # TypeScript interfaces
└── lib/
    └── utils.ts              # Utilities
```

---

## 🚀 How to Use

1. **Open the application** in your browser
2. **Enter a GitHub username** (e.g., "facebook", "google", "vercel")
3. **Click the GitHub icon** or press Enter
4. **Explore the galaxy**:
   - Drag to rotate the view
   - Scroll to zoom in/out
   - Click planets to view repositories
   - Hover to see planets glow

---

## 🎯 Demo Usernames to Try

- `facebook` - Many repos, large sun
- `google` - Large org, many stars
- `vercel` - Modern tech stack repos
- `microsoft` - Enterprise repos
- `tailwindlabs` - Many starred repos
- `typescript` - Language-focused repos

---

## ⚡ Performance Optimizations

- **Limit repos to 30** (prevents performance issues)
- **Limit moons to 5** per planet
- **Efficient useFrame** implementations
- **Minimal state updates**
- **Proper cleanup** in useEffect
- **Optimized geometry** (32 segments for spheres)

---

## 🎨 Visual Design

### Color Scheme
- **Sun**: Gold (#FFD700) + Orange (#FFA500)
- **Planets**: Procedural HSL (high saturation, medium lightness)
- **Moons**: Light gray (#AAAAAA)
- **Background**: Slate gradient (dark)
- **UI**: Purple-to-pink gradient

### Typography
- Headings: Bold, gradient text
- Body: Slate-400 for muted text
- Stats: Colored numbers (purple/pink)

---

## 🛠️ Technologies Used

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **3D Library**: React Three Fiber + Drei
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State**: React hooks (useState, useRef, useFrame)

---

## 📝 Future Enhancements

- [ ] Add repo description tooltips on hover
- [ ] Animate camera to focused planet
- [ ] Filter repositories by language/stars
- [ ] Include forks as separate moons
- [ ] Add commit history visualization
- [ ] Support GitHub organizations
- [ ] Save/load galaxy configurations
- [ ] Export galaxy as image/video
- [ ] Add constellation lines for related repos
- [ ] Include pull requests as additional moons

---

## 📄 License

Built for Z.ai Code - AI-Powered Development Scaffold

---

## 🙏 Acknowledgments

- **Three.js**: 3D rendering engine
- **React Three Fiber**: React renderer for Three.js
- **Drei**: Useful helpers for R3F
- **shadcn/ui**: Beautiful UI components
- **GitHub API**: Data source

---

Made with ❤️ using Next.js + React Three Fiber
