import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

const BG_IMG = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=90'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name:'', email:'', password:'' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError(''); setLoading(true)
    try { await register(form.name, form.email, form.password); navigate('/dashboard') }
    catch (err) { setError(err.response?.data?.message || 'Registration failed. Try again.') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', position:'relative', fontFamily:"'Outfit',sans-serif", overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        input{font-family:'DM Sans',sans-serif;color:#fff;}
        input:-webkit-autofill{-webkit-box-shadow:0 0 0 30px rgba(5,13,31,0.9) inset!important;-webkit-text-fill-color:#fff!important;}
        input:focus{outline:none;}
        .inp-wrap:focus-within{border-color:rgba(99,179,255,0.6)!important;background:rgba(59,139,253,0.08)!important;box-shadow:0 0 0 3px rgba(59,139,253,0.1)!important;}
        .reg-btn:hover{transform:translateY(-2px);box-shadow:0 16px 50px rgba(59,139,253,0.55)!important;}
        .reg-btn:active{transform:translateY(0);}
        @keyframes grain{0%,100%{transform:translate(0,0)}10%{transform:translate(-1%,-2%)}30%{transform:translate(-2%,2%)}50%{transform:translate(-1%,2%)}70%{transform:translate(-1%,-1%)}90%{transform:translate(-2%,-1%)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
      `}</style>

      {/* Full background image */}
      <div style={{ position:'fixed', inset:0, backgroundImage:`url(${BG_IMG})`, backgroundSize:'cover', backgroundPosition:'center', zIndex:0 }}/>
      {/* Dark blue overlay */}
      <div style={{ position:'fixed', inset:0, background:'rgba(2,8,24,0.75)', zIndex:1 }}/>
      {/* Blue gradient */}
      <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg, rgba(29,78,216,0.3) 0%, rgba(2,8,24,0.4) 50%, rgba(2,8,24,0.6) 100%)', zIndex:2 }}/>
      {/* Grain */}
      <div style={{ position:'fixed', inset:0, opacity:0.08, backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, animation:'grain 0.5s steps(1) infinite', zIndex:3, pointerEvents:'none' }}/>

      {/* Centered content */}
      <div style={{ position:'relative', zIndex:10, width:'100%', maxWidth:'480px', padding:'20px' }}>

        {/* Logo - centered at top */}
        <motion.div initial={{ opacity:0, y:-30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }}
          style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:'36px' }}>
          <div style={{ width:'56px', height:'56px', background:'linear-gradient(135deg,#3b8bfd,#1d4ed8)', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', boxShadow:'0 8px 32px rgba(59,139,253,0.5)', marginBottom:'12px' }}>✈️</div>
          <span style={{ color:'#fff', fontSize:'26px', fontWeight:900, letterSpacing:'-0.5px', background:'linear-gradient(135deg,#fff,#93c5fd)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>TripMate</span>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'13px', fontFamily:"'DM Sans',sans-serif", marginTop:'4px', fontWeight:300 }}>Your ultimate travel companion</p>
        </motion.div>

        {/* Glass card */}
        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.1, ease:[0.16,1,0.3,1] }}
          style={{ background:'rgba(5,13,31,0.75)', backdropFilter:'blur(32px)', border:'1px solid rgba(59,139,253,0.2)', borderRadius:'28px', padding:'36px', boxShadow:'0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)' }}>

          <div style={{ textAlign:'center', marginBottom:'28px' }}>
            <h2 style={{ fontSize:'28px', fontWeight:800, letterSpacing:'-1px', color:'#fff', marginBottom:'6px' }}>
              Create your account
            </h2>
            <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'14px', fontFamily:"'DM Sans',sans-serif", fontWeight:300 }}>Start your journey in under 30 seconds ⚡</p>
          </div>

          {error && (
            <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
              style={{ background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:'12px', padding:'12px 16px', color:'#fca5a5', fontSize:'13px', fontFamily:"'DM Sans',sans-serif", marginBottom:'20px', textAlign:'center' }}>
              ⚠️ {error}
            </motion.div>
          )}

          <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            {[
              { key:'name', label:'Full Name', placeholder:'John Doe', icon:'👤', type:'text' },
              { key:'email', label:'Email Address', placeholder:'you@example.com', icon:'📧', type:'email' },
            ].map(({key,label,placeholder,icon,type},idx) => (
              <motion.div key={key} initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.3+idx*0.1 }}>
                <label style={{ color:'rgba(255,255,255,0.4)', fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', display:'block', marginBottom:'8px', fontFamily:"'DM Sans',sans-serif" }}>{label}</label>
                <div className="inp-wrap" style={{ background:'rgba(59,139,253,0.06)', border:'1px solid rgba(59,139,253,0.15)', borderRadius:'14px', padding:'14px 18px', display:'flex', alignItems:'center', gap:'12px', transition:'all 0.3s' }}>
                  <span style={{ fontSize:'17px' }}>{icon}</span>
                  <input type={type} placeholder={placeholder} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}
                    style={{ flex:1, background:'none', border:'none', fontSize:'15px', fontFamily:"'DM Sans',sans-serif", fontWeight:300 }}/>
                </div>
              </motion.div>
            ))}

            <motion.div initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.5 }}>
              <label style={{ color:'rgba(255,255,255,0.4)', fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', display:'block', marginBottom:'8px', fontFamily:"'DM Sans',sans-serif" }}>Password</label>
              <div className="inp-wrap" style={{ background:'rgba(59,139,253,0.06)', border:'1px solid rgba(59,139,253,0.15)', borderRadius:'14px', padding:'14px 18px', display:'flex', alignItems:'center', gap:'12px', transition:'all 0.3s' }}>
                <span style={{ fontSize:'17px' }}>🔒</span>
                <input type={showPass?'text':'password'} placeholder="Min. 6 characters" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}
                  style={{ flex:1, background:'none', border:'none', fontSize:'15px', fontFamily:"'DM Sans',sans-serif", fontWeight:300 }}/>
                <button type="button" onClick={()=>setShowPass(!showPass)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.25)', display:'flex', padding:0, transition:'color 0.2s' }}>
                  {showPass?<EyeOff size={16}/>:<Eye size={16}/>}
                </button>
              </div>
            </motion.div>

            <motion.button initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }}
              type="button" onClick={handleSubmit} disabled={loading} className="reg-btn"
              style={{ marginTop:'6px', width:'100%', background:'linear-gradient(135deg,#3b8bfd,#1d4ed8)', border:'none', borderRadius:'14px', padding:'16px', color:'#fff', fontSize:'16px', fontWeight:700, cursor:loading?'not-allowed':'pointer', opacity:loading?0.7:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', fontFamily:"'Outfit',sans-serif", boxShadow:'0 8px 30px rgba(59,139,253,0.4)', transition:'all 0.3s ease', letterSpacing:'0.3px' }}>
              {loading ? 'Creating account…' : <><span>Create Account</span><ArrowRight size={18}/></>}
            </motion.button>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:'16px', margin:'24px 0' }}>
            <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.06)' }}/>
            <span style={{ color:'rgba(255,255,255,0.15)', fontSize:'11px', fontFamily:"'DM Sans',sans-serif", letterSpacing:'2px' }}>OR</span>
            <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.06)' }}/>
          </div>

          <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'14px', textAlign:'center', fontFamily:"'DM Sans',sans-serif" }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:'#3b8bfd', textDecoration:'none', fontWeight:700 }}>Sign in →</Link>
          </p>
        </motion.div>

        {/* Trust badges */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.8 }}
          style={{ display:'flex', justifyContent:'center', gap:'24px', marginTop:'24px' }}>
          {['🔐 Secure', '⚡ Free Forever', '🌍 Global'].map((b,i) => (
            <span key={i} style={{ color:'rgba(255,255,255,0.25)', fontSize:'12px', fontFamily:"'DM Sans',sans-serif" }}>{b}</span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
