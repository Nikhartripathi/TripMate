import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, MapPin, Calendar, LogOut, Trash2, Eye, X, ArrowUpRight } from 'lucide-react'

const CARD_IMGS = [
  'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=90',
  'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=90',
  'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=90',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=90',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=90',
  'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=90',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=90',
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=90',
]

const HERO_SLIDES = [
  'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600&q=90',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=90',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&q=90',
]

const STATS = [
  { emoji:'✈️', label:'Trips Planned', value:'12,400+' },
  { emoji:'🌍', label:'Destinations', value:'190+' },
  { emoji:'⭐', label:'Happy Travelers', value:'8,200+' },
  { emoji:'🏨', label:'Hotels Listed', value:'3,500+' },
]

const MODAL_IMGS = [
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=90',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=90',
  'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=90',
]

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [heroSlide, setHeroSlide] = useState(0)
  const [modalImg, setModalImg] = useState(0)
  const [form, setForm] = useState({ title:'', source:'', destination:'', startDate:'', endDate:'', budget:'', travelers:{ count:1, type:'solo' } })
  const [creating, setCreating] = useState(false)
  const [hovered, setHovered] = useState(null)

  useEffect(() => {
    api.get('/trips').then(res => setTrips(res.data.trips||[])).catch(console.error).finally(()=>setLoading(false))
    const t = setInterval(() => setHeroSlide(s => (s+1) % HERO_SLIDES.length), 6000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (showCreate) {
      const t = setInterval(() => setModalImg(s => (s+1) % MODAL_IMGS.length), 3000)
      return () => clearInterval(t)
    }
  }, [showCreate])

  const handleLogout = async () => { await logout(); navigate('/login') }

  const handleCreate = async () => {
    if (!form.source||!form.destination) { alert('Source and Destination required!'); return }
    setCreating(true)
    try {
      const res = await api.post('/trips', {
        title: form.title||`${form.source} → ${form.destination}`,
        source: form.source,
        destination: form.destination,
        startDate: form.startDate,
        endDate: form.endDate,
        budget: form.budget||0,
        travelers: form.travelers
      })
      setTrips(prev=>[res.data.trip,...prev])
      setShowCreate(false)
      setForm({ title:'', source:'', destination:'', startDate:'', endDate:'', budget:'', travelers:{ count:1, type:'solo' } })
    } catch(err){ alert(err.response?.data?.message||'Failed') }
    finally{ setCreating(false) }
  }

  const handleDelete = async (id,e) => {
    e.preventDefault(); e.stopPropagation()
    if (!confirm('Delete this trip?')) return
    try{ await api.delete(`/trips/${id}`); setTrips(prev=>prev.filter(t=>t._id!==id)) }
    catch{ alert('Failed') }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#020818', fontFamily:"'Outfit',sans-serif", color:'#fff', overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        *{box-sizing:border-box;}
        ::selection{background:rgba(59,139,253,0.3);}
        .trip-card{transition:all 0.5s cubic-bezier(0.16,1,0.3,1);cursor:pointer;}
        .trip-card:hover{transform:translateY(-12px) scale(1.02);}
        .trip-card:hover .card-img{transform:scale(1.1)!important;}
        .trip-card:hover .card-arrow{opacity:1!important;transform:translate(0,0)!important;}
        .trip-card:hover .card-shine{opacity:1!important;}
        .del-btn:hover{background:rgba(68, 122, 239, 0.75)!important;color:#fff!important;}
        .stat-card:hover{transform:translateY(-4px);border-color:rgba(59,139,253,0.4)!important;background:rgba(59,139,253,0.1)!important;}
        input:focus,select:focus{outline:none;border-color:rgba(99,179,255,0.5)!important;box-shadow:0 0 0 3px rgba(59,139,253,0.1)!important;}
        input,select{font-family:'DM Sans',sans-serif;color:#fff;}
        input:-webkit-autofill{-webkit-box-shadow:0 0 0 30px #030c1e inset!important;-webkit-text-fill-color:#fff!important;}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        .skeleton{background:linear-gradient(90deg,rgba(59, 140, 253, 0.22) 25%,rgba(59,139,253,0.1) 50%,rgba(59,139,253,0.04) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;}
        .plan-btn:hover{transform:translateY(-2px);box-shadow:0 20px 60px rgba(59,139,253,0.55)!important;}
        .inp-row:focus-within{border-color:rgba(99,179,255,0.45)!important;background:rgba(59,139,253,0.07)!important;}
        .view-link:hover{background:rgba(59,139,253,0.25)!important;border-color:rgba(59,139,253,0.4)!important;}
      `}</style>

      {/* ── NAVBAR ── */}
      <motion.nav initial={{ y:-60, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ duration:0.6 }}
        style={{ position:'sticky', top:0, zIndex:100, borderBottom:'1px solid rgba(59,139,253,0.1)', background:'rgba(2,8,24,0.92)', backdropFilter:'blur(28px)', padding:'0 48px', height:'68px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'38px', height:'38px', background:'linear-gradient(135deg,#3b8bfd,#1d4ed8)', borderRadius:'11px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', boxShadow:'0 4px 20px rgba(59,139,253,0.45)' }}>✈️</div>
          <span style={{ fontSize:'21px', fontWeight:800, letterSpacing:'-0.5px', background:'linear-gradient(135deg,#fff 40%,#93c5fd)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>TripMate</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', background:'rgba(59,139,253,0.08)', border:'1px solid rgba(59,139,253,0.15)', borderRadius:'10px', padding:'8px 14px' }}>
            <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#3b8bfd', animation:'pulse 2s infinite', boxShadow:'0 0 6px #3b8bfd' }}/>
            <span style={{ color:'rgba(255,255,255,0.45)', fontSize:'14px', fontFamily:"'DM Sans',sans-serif" }}>
              Hey, <span style={{ color:'#93c5fd', fontWeight:600 }}>{user?.name?.split(' ')[0]||'Explorer'}</span> 👋
            </span>
          </div>
          <button onClick={handleLogout}
            style={{ display:'flex', alignItems:'center', gap:'6px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'9px', padding:'9px 16px', color:'rgba(255,255,255,0.35)', fontSize:'13px', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", transition:'all 0.2s' }}>
            <LogOut size={14}/> Logout
          </button>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <div style={{ position:'relative', height:'460px', overflow:'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div key={heroSlide}
            initial={{ scale:1.07, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.96, opacity:0 }}
            transition={{ duration:1.4, ease:[0.76,0,0.24,1] }}
            style={{ position:'absolute', inset:0, backgroundImage:`url(${HERO_SLIDES[heroSlide]})`, backgroundSize:'cover', backgroundPosition:'center 35%' }}/>
        </AnimatePresence>
        {/* Overlays */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(2,8,24,0.15) 0%, rgba(2,8,24,0.05) 25%, rgba(2,8,24,0.55) 65%, rgba(2,8,24,1) 100%)' }}/>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(29,78,216,0.22) 0%, transparent 55%)' }}/>

        <div style={{ position:'relative', zIndex:5, height:'100%', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'0 52px 48px', maxWidth:'1300px', width:'100%', margin:'0 auto' }}>
          <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.9, ease:[0.16,1,0.3,1] }}>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
              style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(59,139,253,0.18)', border:'1px solid rgba(59,139,253,0.35)', borderRadius:'20px', padding:'6px 16px', marginBottom:'18px', backdropFilter:'blur(12px)' }}>
              <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#3b8bfd', boxShadow:'0 0 8px #3b8bfd', display:'block' }}/>
              <span style={{ color:'#93c5fd', fontSize:'12px', fontFamily:"'DM Sans',sans-serif", letterSpacing:'1px' }}>Your Adventure Dashboard</span>
            </motion.div>
            <h1 style={{ fontSize:'62px', fontWeight:900, letterSpacing:'-3px', lineHeight:0.92, marginBottom:'22px', textShadow:'0 4px 30px rgba(0,0,0,0.5)' }}>
              Where will you<br/>
              <span style={{ background:'linear-gradient(135deg,#3b8bfd,#93c5fd)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>explore next?</span>
            </h1>
            <div style={{ display:'flex', alignItems:'center', gap:'16px', flexWrap:'wrap' }}>
              <button onClick={()=>setShowCreate(true)} className="plan-btn"
                style={{ display:'inline-flex', alignItems:'center', gap:'10px', background:'linear-gradient(135deg,#3b8bfd,#1d4ed8)', border:'none', borderRadius:'14px', padding:'14px 26px', color:'#fff', fontSize:'15px', fontWeight:700, cursor:'pointer', fontFamily:"'Outfit',sans-serif", boxShadow:'0 8px 40px rgba(59,139,253,0.4)', transition:'all 0.3s ease' }}>
                <Plus size={18}/> Plan New Trip
              </button>
              <div style={{ display:'flex', gap:'18px' }}>
                {['🌍 190+ Destinations','✈️ 12K+ Trips','⭐ 8K+ Travelers'].map((t,i)=>(
                  <span key={i} style={{ color:'rgba(255,255,255,0.4)', fontSize:'13px', fontFamily:"'DM Sans',sans-serif" }}>{t}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Slide dots */}
        <div style={{ position:'absolute', bottom:'18px', right:'52px', display:'flex', gap:'6px', zIndex:10 }}>
          {HERO_SLIDES.map((_,i)=>(
            <div key={i} onClick={()=>setHeroSlide(i)}
              style={{ width:i===heroSlide?'22px':'6px', height:'6px', borderRadius:'3px', background:i===heroSlide?'#3b8bfd':'rgba(255,255,255,0.2)', transition:'all 0.4s', cursor:'pointer' }}/>
          ))}
        </div>
      </div>

      {/* ── STATS STRIP ── */}
      <div style={{ borderTop:'1px solid rgba(59,139,253,0.1)', borderBottom:'1px solid rgba(59,139,253,0.1)', background:'rgba(59,139,253,0.03)', padding:'18px 52px' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', display:'flex', justifyContent:'space-between', gap:'12px', flexWrap:'wrap' }}>
          {STATS.map((stat,i)=>(
            <motion.div key={i} className="stat-card"
              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08 }}
              style={{ display:'flex', alignItems:'center', gap:'12px', background:'rgba(59,139,253,0.05)', border:'1px solid rgba(59,139,253,0.1)', borderRadius:'14px', padding:'14px 22px', flex:'1', minWidth:'170px', transition:'all 0.3s', cursor:'default' }}>
              <span style={{ fontSize:'24px' }}>{stat.emoji}</span>
              <div>
                <p style={{ color:'#fff', fontSize:'20px', fontWeight:800, letterSpacing:'-0.5px' }}>{stat.value}</p>
                <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'11px', fontFamily:"'DM Sans',sans-serif" }}>{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── TRIPS ── */}
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'44px 52px 80px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'28px' }}>
          <div>
            <p style={{ color:'rgba(255,255,255,0.2)', fontSize:'11px', letterSpacing:'3px', textTransform:'uppercase', fontFamily:"'DM Sans',sans-serif", marginBottom:'4px' }}>Your Journeys</p>
            <h2 style={{ fontSize:'28px', fontWeight:800, letterSpacing:'-1px' }}>My Trips <span style={{ color:'rgba(255, 255, 255, 0.2)', fontWeight:400, fontSize:'20px' }}>({trips.length})</span></h2>
          </div>
          <button onClick={()=>setShowCreate(true)}
            style={{ display:'flex', alignItems:'center', gap:'7px', background:'rgba(59,139,253,0.1)', border:'1px solid rgba(59,139,253,0.25)', borderRadius:'11px', padding:'10px 18px', color:'#93c5fd', fontSize:'13px', fontWeight:600, cursor:'pointer', fontFamily:"'Outfit',sans-serif", transition:'all 0.2s' }}>
            <Plus size={15}/> New Trip
          </button>
        </div>

        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:'20px' }}>
            {[1,2,3].map(i=><div key={i} className="skeleton" style={{ height:'380px', borderRadius:'24px' }}/>)}
          </div>
        ) : trips.length===0 ? (
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} style={{ textAlign:'center', padding:'80px 0' }}>
            <div style={{ fontSize:'80px', animation:'float 4s ease-in-out infinite', display:'block', marginBottom:'20px' }}>🌏</div>
            <h3 style={{ fontSize:'26px', fontWeight:800, letterSpacing:'-0.5px', marginBottom:'10px' }}>No adventures yet</h3>
            <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'15px', fontFamily:"'DM Sans',sans-serif", marginBottom:'28px' }}>The world is waiting. Start planning your first trip!</p>
            <button onClick={()=>setShowCreate(true)} className="plan-btn"
              style={{ background:'linear-gradient(135deg,#3b8bfd,#1d4ed8)', border:'none', borderRadius:'14px', padding:'14px 28px', color:'#fff', fontWeight:700, fontSize:'15px', cursor:'pointer', fontFamily:"'Outfit',sans-serif", boxShadow:'0 8px 40px rgba(59,139,253,0.35)', transition:'all 0.3s' }}>
              ✈️ Plan First Trip
            </button>
          </motion.div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:'20px' }}>
            {trips.map((trip,i)=>(
              <motion.div key={trip._id} className="trip-card"
                initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08, duration:0.6 }}
                onMouseEnter={()=>setHovered(trip._id)} onMouseLeave={()=>setHovered(null)}
                style={{ background:'#050d1f', borderRadius:'22px', overflow:'hidden', border:`1px solid ${hovered===trip._id?'rgba(59,139,253,0.4)':'rgba(59,139,253,0.1)'}`, boxShadow:hovered===trip._id?'0 28px 70px rgba(0,0,0,0.7), 0 0 50px rgba(59,139,253,0.07)':'0 4px 20px rgba(0,0,0,0.4)', position:'relative' }}
                onClick={()=>navigate(`/trips/${trip._id}`)}>

                <div className="card-shine" style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(59,139,253,0.06), transparent 55%)', opacity:0, transition:'opacity 0.4s', zIndex:1, pointerEvents:'none' }}/>

                {/* Card image - full height, no bottom gap */}
                <div style={{ height:'210px', overflow:'hidden', position:'relative', flexShrink:0 }}>
                  <div className="card-img"
                    style={{ position:'absolute', top:0, left:0, right:0, bottom:0, backgroundImage:`url(${CARD_IMGS[i%CARD_IMGS.length]})`, backgroundSize:'cover', backgroundPosition:'center center', transition:'transform 0.6s cubic-bezier(0.16,1,0.3,1)' }}/>
                  {/* Gradient from bottom */}
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, #050d1f 0%, rgba(5,13,31,0.7) 35%, rgba(5,13,31,0.05) 100%)' }}/>
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(29,78,216,0.18) 0%, transparent 50%)' }}/>
                  {/* Status */}
                  <div style={{ position:'absolute', top:'13px', left:'13px', background:'rgba(2,8,24,0.72)', backdropFilter:'blur(16px)', border:'1px solid rgba(59,139,253,0.3)', borderRadius:'20px', padding:'5px 13px', fontSize:'10px', color:'#93c5fd', textTransform:'uppercase', letterSpacing:'1.5px', fontWeight:700 }}>
                    {trip.status||'planned'}
                  </div>
                  {/* Arrow */}
                  <div className="card-arrow" style={{ position:'absolute', top:'13px', right:'13px', width:'34px', height:'34px', background:'rgba(59,139,253,0.22)', backdropFilter:'blur(12px)', border:'1px solid rgba(59,139,253,0.38)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', opacity:0, transform:'translate(5px,-5px)', transition:'all 0.35s ease' }}>
                    <ArrowUpRight size={15} style={{ color:'#93c5fd' }}/>
                  </div>
                  {/* Title on image */}
                  <div style={{ position:'absolute', bottom:'13px', left:'15px', right:'15px' }}>
                    <h3 style={{ fontSize:'19px', fontWeight:800, letterSpacing:'-0.3px', marginBottom:'4px', textShadow:'0 2px 12px rgba(0,0,0,0.8)' }}>{trip.title}</h3>
                    <p style={{ color:'#93c5fd', fontSize:'13px', display:'flex', alignItems:'center', gap:'4px', fontFamily:"'DM Sans',sans-serif" }}>
                      <MapPin size={12}/> {trip.source} → {trip.destination}
                    </p>
                  </div>
                </div>

                {/* Card footer */}
                <div style={{ padding:'16px', position:'relative', zIndex:2, background:'#050d1f' }}>
                  {trip.startDate && (
                    <p style={{ color:'rgba(255,255,255,0.25)', fontSize:'12px', fontFamily:"'DM Sans',sans-serif", display:'flex', alignItems:'center', gap:'4px', marginBottom:'12px' }}>
                      <Calendar size={11}/> {new Date(trip.startDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})} – {new Date(trip.endDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                    </p>
                  )}
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:'12px', borderTop:'1px solid rgba(59,139,253,0.08)' }}>
                    <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                      <span style={{ background:'rgba(59,139,253,0.08)', border:'1px solid rgba(59,139,253,0.1)', borderRadius:'7px', padding:'4px 10px', color:'rgba(255,255,255,0.4)', fontSize:'11px', fontFamily:"'DM Sans',sans-serif" }}>
                        👥 {trip.travelers?.count||1} {trip.travelers?.type||'solo'}
                      </span>
                      {trip.budget>0 && <span style={{ background:'rgba(59,139,253,0.08)', border:'1px solid rgba(59,139,253,0.1)', borderRadius:'7px', padding:'4px 10px', color:'rgba(255,255,255,0.4)', fontSize:'11px', fontFamily:"'DM Sans',sans-serif" }}>
                        💰 ₹{Number(trip.budget).toLocaleString()}
                      </span>}
                    </div>
                    <div style={{ display:'flex', gap:'7px' }}>
                      <Link to={`/trips/${trip._id}`} onClick={e=>e.stopPropagation()} className="view-link"
                        style={{ display:'flex', alignItems:'center', gap:'5px', background:'rgba(59,139,253,0.12)', border:'1px solid rgba(59,139,253,0.22)', borderRadius:'8px', padding:'7px 13px', color:'#93c5fd', fontSize:'12px', fontWeight:600, textDecoration:'none', fontFamily:"'DM Sans',sans-serif", transition:'all 0.2s' }}>
                        <Eye size={13}/> View
                      </Link>
                      <button onClick={e=>handleDelete(trip._id,e)} className="del-btn"
                        style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(59, 139, 253, 0.12)', borderRadius:'8px', padding:'7px 10px', color:'rgba(121, 100, 239, 0.6)', cursor:'pointer', display:'flex', transition:'all 0.2s' }}>
                        <Trash2 size={13}/>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── CREATE MODAL ── */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={e=>e.target===e.currentTarget&&setShowCreate(false)}
            style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,6,0.9)', backdropFilter:'blur(20px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
            <motion.div initial={{ scale:0.9, opacity:0, y:40 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:0.9, opacity:0 }}
              transition={{ duration:0.45, ease:[0.16,1,0.3,1] }}
              style={{ background:'#030c1e', border:'1px solid rgba(59,139,253,0.2)', borderRadius:'28px', width:'100%', maxWidth:'520px', overflow:'hidden', boxShadow:'0 40px 100px rgba(0,0,0,0.85), 0 0 0 1px rgba(59,139,253,0.08), inset 0 1px 0 rgba(255,255,255,0.04)' }}>

              {/* Modal header - rotating travel images */}
              <div style={{ height:'160px', position:'relative', overflow:'hidden' }}>
                <AnimatePresence mode="wait">
                  <motion.div key={modalImg}
                    initial={{ scale:1.08, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.95, opacity:0 }}
                    transition={{ duration:1, ease:[0.16,1,0.3,1] }}
                    style={{ position:'absolute', inset:0, backgroundImage:`url(${MODAL_IMGS[modalImg]})`, backgroundSize:'cover', backgroundPosition:'center 40%' }}/>
                </AnimatePresence>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(3,12,30,0.2), rgba(3,12,30,1))' }}/>
                <div style={{ position:'absolute', inset:0, background:'rgba(29,78,216,0.2)' }}/>
                <div style={{ position:'absolute', bottom:'18px', left:'28px', right:'28px', display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
                  <div>
                    <p style={{ color:'#3b8bfd', fontSize:'10px', letterSpacing:'3px', fontFamily:"'DM Sans',sans-serif", marginBottom:'5px' }}>✦ NEW ADVENTURE</p>
                    <h2 style={{ fontSize:'24px', fontWeight:800, letterSpacing:'-0.5px' }}>Plan Your Trip ✈️</h2>
                  </div>
                  <button onClick={()=>setShowCreate(false)}
                    style={{ background:'rgba(59,139,253,0.15)', border:'1px solid rgba(59,139,253,0.3)', borderRadius:'10px', padding:'8px', cursor:'pointer', color:'rgba(255,255,255,0.6)', display:'flex' }}>
                    <X size={16}/>
                  </button>
                </div>
              </div>

              <div style={{ padding:'26px 28px 28px' }}>
                <div style={{ display:'flex', flexDirection:'column', gap:'11px' }}>
                  {[
                    {key:'title', label:'Trip Name (optional)', placeholder:'e.g. Summer Escape 2026', icon:'🗺️'},
                    {key:'source', label:'From ✦ Required', placeholder:'e.g. Mumbai, India', icon:'🛫'},
                    {key:'destination', label:'To ✦ Required', placeholder:'e.g. Goa, India', icon:'📍'},
                    {key:'budget', label:'Budget (₹)', placeholder:'e.g. 25000', icon:'💰', type:'number'},
                  ].map(({key,label,placeholder,icon,type})=>(
                    <div key={key}>
                      <label style={{ color:'rgba(255,255,255,0.3)', fontSize:'11px', letterSpacing:'1.5px', textTransform:'uppercase', display:'block', marginBottom:'6px', fontFamily:"'DM Sans',sans-serif" }}>{label}</label>
                      <div className="inp-row" style={{ display:'flex', alignItems:'center', gap:'10px', background:'rgba(59,139,253,0.05)', border:'1px solid rgba(59,139,253,0.12)', borderRadius:'12px', padding:'11px 14px', transition:'all 0.2s' }}>
                        <span style={{ fontSize:'16px' }}>{icon}</span>
                        <input type={type||'text'} placeholder={placeholder} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}
                          style={{ flex:1, background:'none', border:'none', fontSize:'14px', fontFamily:"'DM Sans',sans-serif" }}/>
                      </div>
                    </div>
                  ))}

                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'11px' }}>
                    <div>
                      <label style={{ color:'rgba(255, 255, 255, 0.3)', fontSize:'11px', letterSpacing:'1.5px', textTransform:'uppercase', display:'block', marginBottom:'6px', fontFamily:"'DM Sans',sans-serif" }}>Travelers</label>
                      <div style={{ display:'flex', gap:'7px' }}>
                        <input type="number" min="1" max="20" value={form.travelers.count}
                          onChange={e=>setForm({...form,travelers:{...form.travelers,count:Number(e.target.value)}})}
                          style={{ width:'52px', background:'rgba(59,139,253,0.05)', border:'1px solid rgba(59,139,253,0.12)', borderRadius:'10px', padding:'10px', color:'#fff', fontSize:'14px', textAlign:'center' }}/>
                        <select value={form.travelers.type} onChange={e=>setForm({...form,travelers:{...form.travelers,type:e.target.value}})}
                          style={{ flex:1, background:'rgba(59,139,253,0.05)', border:'1px solid rgba(59,139,253,0.12)', borderRadius:'10px', padding:'10px 12px', color:'#fff', fontSize:'13px', cursor:'pointer' }}>
                          <option value="solo">Solo</option>
                          <option value="couple">Couple</option>
                          <option value="friends">Friends</option>
                          <option value="family">Family</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label style={{ color:'rgba(255, 255, 255, 0.39)', fontSize:'11px', letterSpacing:'1.5px', textTransform:'uppercase', display:'block', marginBottom:'6px', fontFamily:"'DM Sans',sans-serif" }}>Start Date</label>
                      <input type="date" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})}
                        style={{ width:'100%', background:'rgba(59,139,253,0.05)', border:'1px solid rgba(59,139,253,0.12)', borderRadius:'10px', padding:'10px 12px', color:'#fff', fontSize:'13px', colorScheme:'dark' }}/>
                    </div>
                  </div>

                  <div>
                    <label style={{ color:'rgba(255,255,255,0.3)', fontSize:'11px', letterSpacing:'1.5px', textTransform:'uppercase', display:'block', marginBottom:'6px', fontFamily:"'DM Sans',sans-serif" }}>End Date</label>
                    <input type="date" value={form.endDate} onChange={e=>setForm({...form,endDate:e.target.value})}
                      style={{ width:'100%', background:'rgba(59,139,253,0.05)', border:'1px solid rgba(59,139,253,0.12)', borderRadius:'10px', padding:'10px 12px', color:'#fff', fontSize:'13px', colorScheme:'dark' }}/>
                  </div>

                  <div style={{ display:'flex', gap:'10px', marginTop:'6px' }}>
                    <button onClick={()=>setShowCreate(false)}
                      style={{ flex:1, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'12px', padding:'13px', color:'rgba(255,255,255,0.3)', fontSize:'14px', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
                      Cancel
                    </button>
                    <button onClick={handleCreate} disabled={creating}
                      style={{ flex:2, background:'linear-gradient(135deg,#3b8bfd,#1d4ed8)', border:'none', borderRadius:'12px', padding:'13px', color:'#fff', fontSize:'15px', fontWeight:700, cursor:creating?'not-allowed':'pointer', opacity:creating?0.7:1, fontFamily:"'Outfit',sans-serif", boxShadow:'0 8px 32px rgba(59,139,253,0.38)', transition:'all 0.2s' }}>
                      {creating ? 'Creating…' : '✈️ Create Trip'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

