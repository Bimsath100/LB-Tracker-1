const { useState, useEffect, useRef } = React;

const App = () => {
    const [todayHours, setTodayHours] = useState(new Array(15).fill(false));
    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('studyHistory');
        return saved ? JSON.parse(saved) : {};
    });
    const [viewDate, setViewDate] = useState(new Date().toISOString().split('T')[0]);
    const [examDate] = useState(new Date('2026-12-31T00:00:00')); // Default Exam Date
    const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

    // WebGL Background Logic
    useEffect(() => {
        const canvas = document.getElementById('bg-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        const particlesGeometry = new THREE.BufferGeometry();
        const count = 2000;
        const positions = new Float32Array(count * 3);
        
        for(let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 12;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particlesMaterial = new THREE.PointsMaterial({ 
            size: 0.008, 
            color: '#8B5CF6',
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);
        camera.position.z = 4;

        const animate = () => {
            requestAnimationFrame(animate);
            particles.rotation.y += 0.0008;
            particles.rotation.x += 0.0004;
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
        };
    }, []);

    // Exam Countdown Logic
    useEffect(() => {
        const calculateTime = () => {
            const now = new Date();
            const diff = examDate - now;
            if (diff > 0) {
                setTimeLeft({
                    d: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    h: Math.floor((diff / (1000 * 60 * 60)) % 24),
                    m: Math.floor((diff / 1000 / 60) % 60),
                    s: Math.floor((diff / 1000) % 60)
                });
            }
        };
        
        calculateTime();
        const timer = setInterval(calculateTime, 1000);
        return () => clearInterval(timer);
    }, [examDate]);

    // Load data for the selected date
    useEffect(() => {
        if (history[viewDate]) {
            setTodayHours(history[viewDate]);
        } else {
            setTodayHours(new Array(15).fill(false));
        }
    }, [viewDate, history]);

    // Entrance Animations
    useEffect(() => {
        const tl = gsap.timeline();
        tl.from(".header-anim", { y: -100, opacity: 0, duration: 1.2, ease: "power4.out" })
          .from(".tracker-anim", { y: 50, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.8")
          .from(".hour-box", { 
              scale: 0, 
              opacity: 0, 
              duration: 0.6, 
              stagger: { each: 0.04, from: "center" }, 
              ease: "back.out(1.7)" 
          }, "-=0.5")
          .from(".analytics-anim", { y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out" }, "-=0.6");
    }, []);

    const toggleHour = (index) => {
        const newHours = [...todayHours];
        newHours[index] = !newHours[index];
        setTodayHours(newHours);
        
        const newHistory = { ...history, [viewDate]: newHours };
        setHistory(newHistory);
        localStorage.setItem('studyHistory', JSON.stringify(newHistory));
        
        // Haptic feedback animation
        gsap.to(`.hour-${index}`, { 
            scale: 1.15, 
            duration: 0.15, 
            yoyo: true, 
            repeat: 1,
            ease: "power2.inOut"
        });
    };

    const totalHoursToday = todayHours.filter(Boolean).length;

    return (
        <div className="container">
            <header className="glass header-anim">
                <div className="logo">ELITE STUDY TRACKER</div>
                <div className="countdown-container">
                    <CountdownBox value={timeLeft.d} label="Days" />
                    <CountdownBox value={timeLeft.h} label="Hours" />
                    <CountdownBox value={timeLeft.m} label="Mins" />
                    <CountdownBox value={timeLeft.s} label="Secs" />
                </div>
            </header>

            <section className="glass tracker-section tracker-anim">
                <h1 className="tracker-title">Daily Study Grid</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                    Focus Target: <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>15 Hours</span> | 
                    Date: {new Date(viewDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                
                <div className="hour-grid">
                    {todayHours.map((active, i) => (
                        <div 
                            key={i} 
                            className={`hour-box hour-${i} ${active ? 'active' : ''}`}
                            onClick={() => toggleHour(i)}
                        >
                            <span className="hour-number">{i + 1}</span>
                            <span style={{ fontSize: '0.65rem', fontWeight: '600', letterSpacing: '1px', color: active ? 'white' : 'var(--text-secondary)' }}>HOUR</span>
                        </div>
                    ))}
                </div>
                
                <div style={{ marginTop: '2rem', fontSize: '1.2rem', fontWeight: '600' }}>
                    Progress: <span style={{ color: var(--accent) }}>{Math.round((totalHoursToday / 15) * 100)}%</span>
                </div>
            </section>

            <div className="analytics-grid">
                <div className="glass side-panel analytics-anim">
                    <h2>History & Navigation</h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        Select a day to view or edit your study history.
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input 
                            type="date" 
                            value={viewDate} 
                            onChange={(e) => setViewDate(e.target.value)} 
                            style={{ flex: 1 }}
                        />
                        <button 
                            className="btn" 
                            style={{ marginTop: '1rem', width: 'auto', padding: '0.8rem' }}
                            onClick={() => setViewDate(new Date().toISOString().split('T')[0])}
                        >
                            Today
                        </button>
                    </div>
                    
                    <div style={{ marginTop: '2rem' }}>
                        <h3>Recent Activity</h3>
                        <div style={{ marginTop: '1rem' }}>
                            {Object.keys(history).length === 0 ? (
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No records yet. Start ticking!</p>
                            ) : (
                                Object.keys(history).sort().reverse().slice(0, 5).map(date => (
                                    <div key={date} className="history-item">
                                        <span style={{ fontSize: '0.9rem' }}>{date}</span>
                                        <span style={{ color: 'var(--accent)', fontWeight: '700' }}>{history[date].filter(Boolean).length} / 15</span>
                                    </div>
                                ))
                            )}
                        </div>
                    <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                        <h3>Data Management</h3>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            <button className="btn" style={{ flex: 1, fontSize: '0.8rem' }} onClick={() => {
                                const data = localStorage.getItem('studyHistory');
                                const blob = new Blob([data], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `study-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
                                a.click();
                            }}>Backup JSON</button>
                            
                            <button className="btn" style={{ flex: 1, fontSize: '0.8rem' }} onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = '.json';
                                input.onchange = (e) => {
                                    const file = e.target.files[0];
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                        const content = event.target.result;
                                        localStorage.setItem('studyHistory', content);
                                        window.location.reload();
                                    };
                                    reader.readAsText(file);
                                };
                                input.click();
                            }}>Restore</button>
                        </div>
                    </div>
                </div>
                
                <div className="glass main-panel analytics-anim">
                    <h2>Monthly Progress Analytics</h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Your performance over the last 30 days.</p>
                    <ProgressChart history={history} />
                </div>
            </div>
        </div>
    );
};

const CountdownBox = ({ value, label }) => (
    <div className="countdown-item">
        <span className="countdown-value">{String(value).padStart(2, '0')}</span>
        <span className="countdown-label">{label}</span>
    </div>
);

const ProgressChart = ({ history }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        
        // Calculate last 30 days
        const last30Days = [...Array(30)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (29 - i));
            return d.toISOString().split('T')[0];
        });

        const data = last30Days.map(date => history[date] ? history[date].filter(Boolean).length : 0);

        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: last30Days.map(d => d.split('-')[2]), // Just the day number
                datasets: [{
                    label: 'Hours',
                    data: data,
                    backgroundColor: data.map(v => v >= 10 ? 'rgba(139, 92, 246, 0.8)' : 'rgba(139, 92, 246, 0.3)'),
                    borderRadius: 6,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 15,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#A1A1AA', stepSize: 5 }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#71717A', font: { size: 10 } }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#18181B',
                        titleColor: '#FFFFFF',
                        bodyColor: '#A1A1AA',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        displayColors: false
                    }
                }
            }
        });
    }, [history]);

    return (
        <div className="chart-container">
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

// Render the application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
