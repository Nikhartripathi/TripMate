import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

const SLIDES = [
  { city: 'MALDIVES', country: 'South Asia', tag: 'Ocean Paradise', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1400&q=90' },
  { city: 'SANTORINI', country: 'Greece', tag: 'Island Dreams', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1400&q=90' },
  { city: 'ICELAND', country: 'Nordic', tag: 'Northern Lights', img: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1400&q=90' },
  { city: 'AMALFI', country: 'Italy', tag: 'Coastal Bliss', img: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1400&q=90' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [slide, setSlide] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const handler = e => setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  const handleSubmit = async () => {
    setError(''); setLoading(true)
    try { await login(form.email, form.password); navigate('/dashboard') }
    catch (err) { setError(err.response?.data?.message || 'Invalid credentials') }
    finally { setLoading(false) }
  }

  const current = SLIDES[slide]

  return (
    <div style={{ minHeight:'100vh', display:'flex', fontFamily:"'Outfit',sans-serif", overflow:'hidden', background:'#020818' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        input{font-family:'DM Sans',sans-serif;color:#fff;}
        input:-webkit-autofill{-webkit-box-shadow:0 0 0 30px #050d1f inset!important;-webkit-text-fill-color:#fff!important;}
        input:focus{outline:none;}
        .inp-wrap:focus-within{border-color:rgba(99,179,255,0.5)!important;background:rgba(99,179,255,0.05)!important;box-shadow:0 0 0 3px rgba(99,179,255,0.08)!important;}
        .slide-dot{transition:all 0.4s ease;cursor:pointer;}
        .sign-btn{transition:all 0.3s ease;}
        .sign-btn:hover{transform:translateY(-2px);box-shadow:0 16px 50px rgba(56,139,253,0.5)!important;}
        .sign-btn:active{transform:translateY(0);}
        @keyframes grain{0%,100%{transform:translate(0,0)}10%{transform:translate(-1%,-2%)}20%{transform:translate(1%,1%)}30%{transform:translate(-2%,2%)}40%{transform:translate(1%,-1%)}50%{transform:translate(-1%,2%)}60%{transform:translate(2%,0)}70%{transform:translate(-1%,-1%)}80%{transform:translate(1%,2%)}90%{transform:translate(-2%,-1%)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
      `}</style>

      {/* LEFT: Slideshow */}
      <div style={{ flex:'0 0 56%', position:'relative', overflow:'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div key={slide}
            initial={{ scale:1.08, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.96, opacity:0 }}
            transition={{ duration:1.4, ease:[0.76,0,0.24,1] }}
            style={{ position:'absolute', inset:0, backgroundImage:`url(${current.img})`, backgroundSize:'cover', backgroundPosition:'center',
              transform:`translate(${(mousePos.x-0.5)*-18}px, ${(mousePos.y-0.5)*-12}px)` }}
          />
        </AnimatePresence>

        {/* Grain */}
        <div style={{ position:'absolute', inset:0, opacity:0.12, backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, animation:'grain 0.4s steps(1) infinite', pointerEvents:'none' }}/>

        {/* Blue tint overlays */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(2,8,24,0.15) 0%, rgba(14,30,80,0.2) 50%, rgba(2,8,24,0.75) 100%)' }}/>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(2,8,24,0.25) 0%, transparent 35%, transparent 55%, rgba(2,8,24,0.97) 100%)' }}/>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right, transparent 60%, rgba(2,8,24,0.98) 100%)' }}/>

        {/* Top */}
        <div style={{ position:'absolute', top:0, left:0, right:0, padding:'32px 36px', display:'flex', alignItems:'center', justifyContent:'space-between', zIndex:10 }}>
          <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.3 }}
            style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'38px', height:'38px', background:'linear-gradient(135deg,#3b8bfd,#1d4ed8)', borderRadius:'11px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', boxShadow:'0 4px 20px rgba(59,139,253,0.5)' }}>✈️</div>
            <span style={{ color:'#fff', fontSize:'21px', fontWeight:800, letterSpacing:'-0.5px' }}>TripMate</span>
          </motion.div>
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
            style={{ background:'rgba(255,255,255,0.07)', backdropFilter:'blur(16px)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'20px', padding:'7px 16px', fontSize:'12px', color:'rgba(255,255,255,0.6)', fontFamily:"'DM Sans',sans-serif" }}>
            ✦ 12,400+ trips planned
          </motion.div>
        </div>

        {/* City name */}
        <div style={{ position:'absolute', bottom:'110px', left:'36px', right:'36px', zIndex:10 }}>
          <AnimatePresence mode="wait">
            <motion.div key={`city-${slide}`}
              initial={{ opacity:0, y:50 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
              transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}>
              <p style={{ color:'#63b3ff', fontSize:'11px', letterSpacing:'5px', fontFamily:"'DM Sans',sans-serif", fontWeight:500, marginBottom:'10px', textTransform:'uppercase' }}>{current.tag}</p>
              <h2 style={{ fontSize:'76px', fontWeight:900, color:'#fff', letterSpacing:'-4px', lineHeight:0.88, textShadow:'0 4px 40px rgba(0,0,0,0.6)', marginBottom:'10px' }}>{current.city}</h2>
              <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'15px', fontFamily:"'DM Sans',sans-serif", fontWeight:300 }}>{current.country}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div style={{ position:'absolute', bottom:'50px', left:'36px', display:'flex', gap:'8px', zIndex:10 }}>
          {SLIDES.map((_,i) => (
            <div key={i} className="slide-dot" onClick={() => setSlide(i)}
              style={{ width:i===slide?'32px':'7px', height:'7px', borderRadius:'4px', background:i===slide?'#3b8bfd':'rgba(255,255,255,0.25)', transition:'all 0.4s ease' }}/>
          ))}
        </div>

        {/* Floating card */}
        <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:4.5, repeat:Infinity, ease:'easeInOut' }}
          style={{ position:'absolute', top:'42%', right:'48px', zIndex:10, background:'rgba(14,30,80,0.5)', backdropFilter:'blur(24px)', border:'1px solid rgba(99,179,255,0.2)', borderRadius:'22px', padding:'22px 26px', minWidth:'170px', boxShadow:'0 20px 60px rgba(0,0,0,0.4)' }}>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'10px', letterSpacing:'2px', textTransform:'uppercase', fontFamily:"'DM Sans',sans-serif", marginBottom:'6px' }}>Top Rated</p>
          <div style={{ display:'flex', alignItems:'baseline', gap:'4px', marginBottom:'4px' }}>
            <span style={{ color:'#fff', fontSize:'32px', fontWeight:900, letterSpacing:'-1px' }}>4.9</span>
            <span style={{ color:'#3b8bfd', fontSize:'16px' }}>★</span>
          </div>
          <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'11px', fontFamily:"'DM Sans',sans-serif" }}>by 8,200+ travelers</p>
        </motion.div>
      </div>

      {/* RIGHT: Form */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'60px 52px', background:'#020818', position:'relative' }}>
        <div style={{ position:'absolute', top:'25%', left:'0%', width:'350px', height:'350px', borderRadius:'50%', background:'radial-gradient(circle, rgba(59,139,253,0.08) 0%, transparent 70%)', filter:'blur(30px)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:'15%', right:'-10%', width:'250px', height:'250px', borderRadius:'50%', background:'radial-gradient(circle, rgba(29,78,216,0.06) 0%, transparent 70%)', filter:'blur(30px)', pointerEvents:'none' }}/>

        <motion.div initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}
          style={{ width:'100%', maxWidth:'370px' }}>

          <motion.div initial={{ opacity:0, y:-15 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
            style={{ marginBottom:'44px' }}>
            <h1 style={{ fontSize:'38px', fontWeight:900, color:'#fff', letterSpacing:'-1.5px', lineHeight:1.05, marginBottom:'10px' }}>
              Welcome<br/>
              <span style={{ background:'linear-gradient(135deg,#3b8bfd,#93c5fd)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>back.</span>
            </h1>
            <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'14px', fontFamily:"'DM Sans',sans-serif", fontWeight:300 }}>Sign in to continue your journey ✈️</p>
          </motion.div>

          {error && (
            <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
              style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:'12px', padding:'12px 16px', color:'#fca5a5', fontSize:'13px', fontFamily:"'DM Sans',sans-serif", marginBottom:'20px' }}>
              ⚠️ {error}
            </motion.div>
          )}

          <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            {[
              { key:'email', label:'Email Address', placeholder:'you@example.com', icon:'📧', type:'email' },
              { key:'password', label:'Password', placeholder:'••••••••', icon:'🔒', type: showPass?'text':'password', extra: (
                <button type="button" onClick={()=>setShowPass(!showPass)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.2)', display:'flex', padding:0 }}>
                  {showPass?<EyeOff size={15}/>:<Eye size={15}/>}
                </button>
              )},
            ].map(({key,label,placeholder,icon,type,extra},idx) => (
              <motion.div key={key} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3+idx*0.1 }}>
                <label style={{ color:'rgba(255,255,255,0.3)', fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', display:'block', marginBottom:'8px', fontFamily:"'DM Sans',sans-serif" }}>{label}</label>
                <div className="inp-wrap" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'14px', padding:'14px 18px', display:'flex', alignItems:'center', gap:'12px', transition:'all 0.3s' }}>
                  <span style={{ fontSize:'16px' }}>{icon}</span>
                  <input type={type} placeholder={placeholder} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}
                    style={{ flex:1, background:'none', border:'none', fontSize:'14px', fontFamily:"'DM Sans',sans-serif", fontWeight:300 }}/>
                  {extra}
                </div>
              </motion.div>
            ))}

            <motion.button initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
              type="button" onClick={handleSubmit} disabled={loading} className="sign-btn"
              style={{ marginTop:'6px', width:'100%', background:'linear-gradient(135deg,#3b8bfd,#1d4ed8)', border:'none', borderRadius:'14px', padding:'16px', color:'#fff', fontSize:'15px', fontWeight:700, cursor:loading?'not-allowed':'pointer', opacity:loading?0.7:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', fontFamily:"'Outfit',sans-serif", letterSpacing:'0.5px', boxShadow:'0 8px 30px rgba(59,139,253,0.35)' }}>
              {loading ? 'Signing in…' : <><span>Sign In</span><ArrowRight size={17}/></>}
            </motion.button>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:'16px', margin:'28px 0' }}>
            <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.06)' }}/>
            <span style={{ color:'rgba(255,255,255,0.15)', fontSize:'11px', fontFamily:"'DM Sans',sans-serif", letterSpacing:'2px' }}>OR</span>
            <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.06)' }}/>
          </div>

          <p style={{ color:'rgba(255,255,255,0.25)', fontSize:'13px', textAlign:'center', fontFamily:"'DM Sans',sans-serif" }}>
            New to TripMate?{' '}
            <Link to="/register" style={{ color:'#3b8bfd', textDecoration:'none', fontWeight:600 }}>Create account →</Link>
          </p>

          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.8 }}
            style={{ marginTop:'36px', display:'flex', justifyContent:'center', gap:'24px' }}>
            {['🔐 Secure', '⚡ Instant', '🌍 Global'].map((b,i) => (
              <span key={i} style={{ color:'rgba(255,255,255,0.15)', fontSize:'12px', fontFamily:"'DM Sans',sans-serif" }}>{b}</span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}