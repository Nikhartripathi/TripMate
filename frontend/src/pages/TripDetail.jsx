import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MapPin, Calendar, Star, Wallet, Clock, Plane, Train, Bus, Car, X, Plus } from 'lucide-react'

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
  'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1200&q=80',
  'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&q=80',
]

const TRANSPORT_ICONS = { flight: Plane, train: Train, bus: Bus, cab: Car }
const TRANSPORT_COLORS = { flight: '#60a5fa', train: '#34d399', bus: '#260bf5', cab: '#a78bfa' }

const inputStyle = {
  width:'100%', background:'#1a1a27',
  border:'1px solid rgba(255,255,255,0.08)', borderRadius:'10px',
  padding:'11px 14px', color:'#fff', fontSize:'14px',
  fontFamily:"'DM Sans',sans-serif", transition:'all 0.2s',
}
const labelStyle = {
  color:'rgba(255,255,255,0.4)', fontSize:'11px',
  letterSpacing:'1px', textTransform:'uppercase',
  display:'block', marginBottom:'6px',
}

export default function TripDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [showTransportModal, setShowTransportModal] = useState(false)
  const [showHotelModal, setShowHotelModal] = useState(false)
  const [generatingItinerary, setGeneratingItinerary] = useState(false)
  const [transportForm, setTransportForm] = useState({ mode:'flight', from:'', to:'', departureTime:'', arrivalTime:'', duration:'', price:'', operator:'', class:'' })
  const [hotelSearch, setHotelSearch] = useState('')
  const [hotels, setHotels] = useState([])
  const [savingTransport, setSavingTransport] = useState(false)

  useEffect(() => {
    api.get(`/trips/${id}`)
      .then(res => setTrip(res.data.trip))
      .catch(() => setError('Trip not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleGenerateItinerary = async () => {
    setGeneratingItinerary(true)
    try {
      const res = await api.post(`/trips/${id}/itinerary`)
      setTrip(res.data.trip)
      setActiveTab('itinerary')
      alert('Itinerary generated successfully!')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate itinerary')
    } finally {
      setGeneratingItinerary(false)
    }
  }

  const handleAddTransport = async () => {
    if (!transportForm.mode) return
    setSavingTransport(true)
    try {
      const res = await api.post(`/trips/${id}/transport`, {
        ...transportForm,
        price: transportForm.price ? Number(transportForm.price) : 0,
      })
      setTrip(res.data.trip)
      setShowTransportModal(false)
      setTransportForm({ mode:'flight', from:'', to:'', departureTime:'', arrivalTime:'', duration:'', price:'', operator:'', class:'' })
      setActiveTab('transport')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add transport')
    } finally {
      setSavingTransport(false)
    }
  }

  const handleSearchHotels = async () => {
    try {
      const res = await api.get(`/hotels?search=${hotelSearch}&city=${trip.destination}`)
      setHotels(res.data.hotels || res.data.data || [])
    } catch {
      alert('Could not fetch hotels')
    }
  }

  const handleAddHotel = async (hotelId) => {
    try {
      const res = await api.post(`/trips/${id}/hotels`, { hotelId })
      setTrip(res.data.trip)
      setShowHotelModal(false)
      setActiveTab('hotels')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add hotel')
    }
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#07070c', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:'36px', height:'36px', borderRadius:'50%', border:'2.5px solid #b940ff', borderTopColor:'transparent', animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (error) return (
    <div style={{ minHeight:'100vh', background:'#07070c', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'16px', color:'#fff', fontFamily:"'DM Sans',sans-serif" }}>
      <span style={{ fontSize:'48px' }}>😕</span>
      <p style={{ color:'rgba(255,255,255,0.5)' }}>{error}</p>
      <button onClick={()=>navigate('/dashboard')} style={{ background:'linear-gradient(135deg,#ffb340,#ff6b30)', border:'none', borderRadius:'10px', padding:'10px 20px', color:'#07070c', fontWeight:700, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Back to Dashboard</button>
    </div>
  )

  const heroImg = HERO_IMAGES[trip._id?.charCodeAt(0) % HERO_IMAGES.length] || HERO_IMAGES[0]
  const tabs = ['overview', 'itinerary', 'transport', 'hotels']

  return (
    <div style={{ minHeight:'100vh', background:'#07070c', fontFamily:"'DM Sans',sans-serif", color:'#fff' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700;9..40,800&display=swap');
        *{box-sizing:border-box;}
        @keyframes spin{to{transform:rotate(360deg)}}
        .tab-btn:hover{color:#fff!important;background:rgba(255,255,255,0.06)!important;}
        .action-btn:hover{background:rgba(135, 60, 255, 0.2)!important;border-color:rgba(73, 60, 255, 0.4)!important;}
        input:focus{outline:none;border-color:rgba(50, 60, 255, 0.5)!important;}
        select:focus{outline:none;}
        .hotel-card:hover{border-color:rgba(60, 102, 255, 0.3)!important;background:#1a1a27!important;}
      `}</style>

      {/* HERO */}
      <div style={{ position:'relative', height:'380px', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:`url(${heroImg})`, backgroundSize:'cover', backgroundPosition:'center' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(7,7,12,0.4) 0%, rgba(7,7,12,0.98) 100%)' }} />
        <Link to="/dashboard" style={{ position:'absolute', top:'28px', left:'32px', zIndex:10, display:'flex', alignItems:'center', gap:'8px', background:'rgba(0,0,0,0.4)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'10px', padding:'9px 16px', color:'rgba(255,255,255,0.7)', textDecoration:'none', fontSize:'13px', fontWeight:500 }}>
          <ArrowLeft size={15}/> Dashboard
        </Link>
        <div style={{ position:'absolute', top:'28px', right:'32px', zIndex:10, display:'flex', alignItems:'center', gap:'8px' }}>
          <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'linear-gradient(135deg,#ffb340,#ff6b30)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px' }}>✈️</div>
          <span style={{ fontWeight:800, fontSize:'17px' }}>TripMate</span>
        </div>
        <div style={{ position:'absolute', bottom:'32px', left:'32px', right:'32px', zIndex:10 }}>
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px' }}>
              <span style={{ background:'rgba(255,180,60,0.2)', border:'1px solid rgba(255,180,60,0.3)', borderRadius:'20px', padding:'4px 12px', fontSize:'11px', color:'#4d40ff', textTransform:'capitalize', fontWeight:600 }}>{trip.status}</span>
              {trip.travelers && <span style={{ background:'rgba(255,255,255,0.08)', borderRadius:'20px', padding:'4px 12px', fontSize:'11px', color:'rgba(255,255,255,0.5)', textTransform:'capitalize' }}>{trip.travelers.count} {trip.travelers.type}</span>}
            </div>
            <h1 style={{ fontSize:'42px', fontWeight:800, letterSpacing:'-1.5px', lineHeight:1.1, marginBottom:'10px' }}>{trip.title}</h1>
            <div style={{ display:'flex', alignItems:'center', gap:'20px', flexWrap:'wrap' }}>
              <span style={{ color:'#4040ff', fontSize:'15px', display:'flex', alignItems:'center', gap:'5px' }}><MapPin size={14}/> {trip.source} → {trip.destination}</span>
              {trip.startDate && <span style={{ color:'rgba(255,255,255,0.4)', fontSize:'14px', display:'flex', alignItems:'center', gap:'5px' }}><Calendar size={13}/> {new Date(trip.startDate).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})} – {new Date(trip.endDate).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</span>}
              {trip.budget > 0 && <span style={{ color:'rgba(255,255,255,0.4)', fontSize:'14px', display:'flex', alignItems:'center', gap:'5px' }}><Wallet size={13}/> ₹{trip.budget.toLocaleString()}</span>}
            </div>
          </motion.div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ borderBottom:'1px solid rgba(255,255,255,0.07)', background:'rgba(7,7,12,0.9)', backdropFilter:'blur(20px)', position:'sticky', top:0, zIndex:50 }}>
        <div style={{ maxWidth:'1000px', margin:'0 auto', padding:'0 32px', display:'flex', gap:'4px' }}>
          {tabs.map(tab => (
            <button key={tab} className="tab-btn" onClick={()=>setActiveTab(tab)}
              style={{ background: activeTab===tab ? 'rgba(255,180,60,0.1)' : 'transparent', border:'none', borderBottom: activeTab===tab ? '2px solid #5340ff' : '2px solid transparent', padding:'16px 20px', color: activeTab===tab ? '#ffb340' : 'rgba(255,255,255,0.35)', fontSize:'13px', fontWeight: activeTab===tab ? 700 : 400, cursor:'pointer', textTransform:'capitalize', fontFamily:"'DM Sans',sans-serif", transition:'all 0.2s' }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth:'1000px', margin:'0 auto', padding:'40px 32px 80px' }}>

        {/* OVERVIEW */}
        {activeTab==='overview' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'16px', marginBottom:'32px' }}>
              {[
                { icon:'📍', label:'From', value: trip.source },
                { icon:'🎯', label:'To', value: trip.destination },
                { icon:'👥', label:'Travelers', value: `${trip.travelers?.count||1} ${trip.travelers?.type||'solo'}` },
                { icon:'💰', label:'Budget', value: trip.budget>0 ? `₹${trip.budget.toLocaleString()}` : 'Not set' },
                { icon:'🏨', label:'Hotels', value: `${trip.hotels?.length||0} added` },
                { icon:'🚌', label:'Transport', value: `${trip.transport?.length||0} segments` },
                { icon:'📅', label:'Itinerary', value: `${trip.itinerary?.length||0} days planned` },
                { icon:'⭐', label:'Rating', value: trip.rating>0 ? `${trip.rating}/5` : 'Not rated' },
              ].map((stat,i) => (
                <motion.div key={i} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.05 }}
                  style={{ background:'#10101a', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'16px', padding:'20px' }}>
                  <span style={{ fontSize:'24px', display:'block', marginBottom:'8px' }}>{stat.icon}</span>
                  <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'11px', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'4px' }}>{stat.label}</p>
                  <p style={{ color:'#fff', fontSize:'16px', fontWeight:700, textTransform:'capitalize' }}>{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div style={{ background:'#10101a', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'20px', padding:'24px' }}>
              <h3 style={{ fontSize:'16px', fontWeight:700, marginBottom:'16px', color:'rgba(255,255,255,0.7)' }}>Quick Actions</h3>
              <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
                <button className="action-btn" onClick={()=>setShowTransportModal(true)}
                  style={{ background:'rgba(255,180,60,0.08)', border:'1px solid rgba(255,180,60,0.2)', borderRadius:'10px', padding:'11px 18px', color:'#ffb340', fontSize:'13px', fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", transition:'all 0.2s', display:'flex', alignItems:'center', gap:'6px' }}>
                  <Plus size={14}/> Add Transport
                </button>
                <button className="action-btn" onClick={()=>setShowHotelModal(true)}
                  style={{ background:'rgba(255,180,60,0.08)', border:'1px solid rgba(255,180,60,0.2)', borderRadius:'10px', padding:'11px 18px', color:'#ffb340', fontSize:'13px', fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", transition:'all 0.2s', display:'flex', alignItems:'center', gap:'6px' }}>
                  <Plus size={14}/> Add Hotel
                </button>
                <button className="action-btn" onClick={handleGenerateItinerary} disabled={generatingItinerary}
                  style={{ background: generatingItinerary ? 'rgba(255,180,60,0.2)' : 'rgba(255,180,60,0.08)', border:'1px solid rgba(255,180,60,0.2)', borderRadius:'10px', padding:'11px 18px', color:'#ffb340', fontSize:'13px', fontWeight:600, cursor: generatingItinerary ? 'not-allowed' : 'pointer', fontFamily:"'DM Sans',sans-serif", transition:'all 0.2s', display:'flex', alignItems:'center', gap:'6px' }}>
                  {generatingItinerary ? '⏳ Generating…' : '✨ Generate Itinerary'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ITINERARY */}
        {activeTab==='itinerary' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}>
            {!trip.itinerary?.length ? (
              <div style={{ textAlign:'center', padding:'60px 0' }}>
                <span style={{ fontSize:'56px', display:'block', marginBottom:'16px' }}>📋</span>
                <h3 style={{ fontSize:'20px', fontWeight:700, marginBottom:'8px' }}>No itinerary yet</h3>
                <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'14px', marginBottom:'24px' }}>Generate a day-by-day plan automatically</p>
                <button onClick={handleGenerateItinerary} disabled={generatingItinerary}
                  style={{ background:'linear-gradient(135deg,#ffb340,#ff6b30)', border:'none', borderRadius:'12px', padding:'13px 28px', color:'#07070c', fontWeight:700, fontSize:'14px', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
                  {generatingItinerary ? '⏳ Generating…' : '✨ Generate Itinerary'}
                </button>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                {trip.itinerary.map((day, i) => (
                  <motion.div key={i} initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.08 }}
                    style={{ background:'#10101a', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'18px', overflow:'hidden' }}>
                    <div style={{ background:'rgba(255,180,60,0.08)', borderBottom:'1px solid rgba(255,180,60,0.1)', padding:'16px 20px', display:'flex', alignItems:'center', gap:'12px' }}>
                      <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'linear-gradient(135deg,#ffb340,#ff6b30)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:'#07070c', fontSize:'14px' }}>D{day.day}</div>
                      <h3 style={{ fontWeight:700, fontSize:'16px' }}>{day.title || `Day ${day.day}`}</h3>
                    </div>
                    <div style={{ padding:'16px 20px', display:'flex', flexDirection:'column', gap:'10px' }}>
                      {day.activities?.map((act, j) => (
                        <div key={j} style={{ display:'flex', gap:'12px', alignItems:'flex-start', padding:'10px 14px', background:'rgba(255,255,255,0.03)', borderRadius:'10px' }}>
                          <span style={{ fontSize:'18px', flexShrink:0 }}>{act.type==='food'?'🍽️':act.type==='transport'?'🚌':act.type==='hotel'?'🏨':act.type==='place'?'📍':'⭐'}</span>
                          <div style={{ flex:1 }}>
                            <p style={{ fontWeight:600, fontSize:'14px', marginBottom:'2px' }}>{act.activity}</p>
                            <div style={{ display:'flex', gap:'12px' }}>
                              {act.time && <span style={{ color:'rgba(255,255,255,0.35)', fontSize:'12px', display:'flex', alignItems:'center', gap:'4px' }}><Clock size={10}/> {act.time}</span>}
                              {act.cost>0 && <span style={{ color:'#4090ff', fontSize:'12px' }}>₹{act.cost}</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* TRANSPORT */}
        {activeTab==='transport' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}>
            <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'20px' }}>
              <button onClick={()=>setShowTransportModal(true)} style={{ background:'linear-gradient(135deg,#ffb340,#ff6b30)', border:'none', borderRadius:'10px', padding:'11px 20px', color:'#07070c', fontWeight:700, fontSize:'13px', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", display:'flex', alignItems:'center', gap:'6px' }}>
                <Plus size={15}/> Add Transport
              </button>
            </div>
            {!trip.transport?.length ? (
              <div style={{ textAlign:'center', padding:'60px 0' }}>
                <span style={{ fontSize:'56px', display:'block', marginBottom:'16px' }}>🚌</span>
                <h3 style={{ fontSize:'20px', fontWeight:700, marginBottom:'8px' }}>No transport added</h3>
                <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'14px' }}>Add flights, trains, buses or cabs</p>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
                {trip.transport.map((t, i) => {
                  const Icon = TRANSPORT_ICONS[t.mode] || Bus
                  const color = TRANSPORT_COLORS[t.mode] || '#fff'
                  return (
                    <motion.div key={i} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08 }}
                      style={{ background:'#10101a', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'18px', padding:'22px', display:'flex', gap:'18px', alignItems:'center' }}>
                      <div style={{ width:'48px', height:'48px', borderRadius:'14px', background:`${color}18`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <Icon size={22} style={{ color }}/>
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
                          <span style={{ color, fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px' }}>{t.mode}</span>
                          {t.operator && <span style={{ color:'rgba(255,255,255,0.3)', fontSize:'12px' }}>· {t.operator}</span>}
                          {t.class && <span style={{ color:'rgba(255,255,255,0.3)', fontSize:'12px' }}>· {t.class}</span>}
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'6px' }}>
                          <span style={{ color:'#fff', fontWeight:700, fontSize:'16px' }}>{t.from||trip.source}</span>
                          <span style={{ color:'rgba(255,255,255,0.3)' }}>→</span>
                          <span style={{ color:'#fff', fontWeight:700, fontSize:'16px' }}>{t.to||trip.destination}</span>
                        </div>
                        <div style={{ display:'flex', gap:'16px' }}>
                          {t.departureTime && <span style={{ color:'rgba(255,255,255,0.35)', fontSize:'12px' }}>Dep: {t.departureTime}</span>}
                          {t.arrivalTime && <span style={{ color:'rgba(255,255,255,0.35)', fontSize:'12px' }}>Arr: {t.arrivalTime}</span>}
                          {t.duration && <span style={{ color:'rgba(255,255,255,0.35)', fontSize:'12px' }}>⏱ {t.duration}</span>}
                        </div>
                      </div>
                      {t.price>0 && (
                        <div style={{ textAlign:'right', flexShrink:0 }}>
                          <p style={{ color:'#5040ff', fontWeight:800, fontSize:'18px' }}>₹{t.price.toLocaleString()}</p>
                          <p style={{ color:'rgba(255, 255, 255, 0.3)', fontSize:'11px' }}>per person</p>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* HOTELS */}
        {activeTab==='hotels' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}>
            <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'20px' }}>
              <button onClick={()=>setShowHotelModal(true)} style={{ background:'linear-gradient(135deg,#ffb340,#ff6b30)', border:'none', borderRadius:'10px', padding:'11px 20px', color:'#07070c', fontWeight:700, fontSize:'13px', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", display:'flex', alignItems:'center', gap:'6px' }}>
                <Plus size={15}/> Add Hotel
              </button>
            </div>
            {!trip.hotels?.length ? (
              <div style={{ textAlign:'center', padding:'60px 0' }}>
                <span style={{ fontSize:'56px', display:'block', marginBottom:'16px' }}>🏨</span>
                <h3 style={{ fontSize:'20px', fontWeight:700, marginBottom:'8px' }}>No hotels added</h3>
                <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'14px' }}>Search and add hotels for your trip</p>
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'16px' }}>
                {trip.hotels.map((hotel, i) => (
                  <motion.div key={i} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08 }}
                    style={{ background:'#10101a', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'18px', overflow:'hidden' }}>
                    <div style={{ height:'140px', background:'linear-gradient(135deg,#1a1a27,#13131e)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'48px' }}>🏨</div>
                    <div style={{ padding:'16px' }}>
                      <h3 style={{ fontWeight:700, fontSize:'16px', marginBottom:'4px' }}>{hotel.name||'Hotel'}</h3>
                      {hotel.city && <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'13px', display:'flex', alignItems:'center', gap:'4px' }}><MapPin size={11}/> {hotel.city}</p>}
                      {hotel.rating>0 && <div style={{ display:'flex', gap:'2px', marginTop:'8px' }}>{[...Array(5)].map((_,j)=><Star key={j} size={12} style={{ color:j<hotel.rating?'#4043ff':'rgba(255,255,255,0.15)', fill:j<hotel.rating?'#4046ff':'none' }}/>)}</div>}
                      {hotel.price>0 && <p style={{ color:'#4040ff', fontWeight:700, fontSize:'16px', marginTop:'8px' }}>₹{hotel.price.toLocaleString()}/night</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* ADD TRANSPORT MODAL */}
      <AnimatePresence>
        {showTransportModal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={e=>e.target===e.currentTarget&&setShowTransportModal(false)}
            style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
            <motion.div initial={{ scale:0.9, opacity:0, y:20 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:0.9, opacity:0 }}
              style={{ background:'#10101a', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'24px', width:'100%', maxWidth:'500px', padding:'32px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
                <h2 style={{ fontSize:'20px', fontWeight:800 }}>Add Transport 🚌</h2>
                <button onClick={()=>setShowTransportModal(false)} style={{ background:'rgba(255,255,255,0.06)', border:'none', borderRadius:'8px', padding:'6px', cursor:'pointer', color:'rgba(255,255,255,0.5)', display:'flex' }}><X size={16}/></button>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                <div>
                  <label style={labelStyle}>Mode *</label>
                  <select value={transportForm.mode} onChange={e=>setTransportForm({...transportForm,mode:e.target.value})}
                    style={{ ...inputStyle, cursor:'pointer' }}>
                    <option value="flight">✈️ Flight</option>
                    <option value="train">🚂 Train</option>
                    <option value="bus">🚌 Bus</option>
                    <option value="cab">🚗 Cab</option>
                  </select>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                  <div>
                    <label style={labelStyle}>From</label>
                    <input style={inputStyle} placeholder={trip.source} value={transportForm.from} onChange={e=>setTransportForm({...transportForm,from:e.target.value})}/>
                  </div>
                  <div>
                    <label style={labelStyle}>To</label>
                    <input style={inputStyle} placeholder={trip.destination} value={transportForm.to} onChange={e=>setTransportForm({...transportForm,to:e.target.value})}/>
                  </div>
                  <div>
                    <label style={labelStyle}>Departure Time</label>
                    <input style={inputStyle} placeholder="e.g. 08:30 AM" value={transportForm.departureTime} onChange={e=>setTransportForm({...transportForm,departureTime:e.target.value})}/>
                  </div>
                  <div>
                    <label style={labelStyle}>Arrival Time</label>
                    <input style={inputStyle} placeholder="e.g. 11:00 AM" value={transportForm.arrivalTime} onChange={e=>setTransportForm({...transportForm,arrivalTime:e.target.value})}/>
                  </div>
                  <div>
                    <label style={labelStyle}>Duration</label>
                    <input style={inputStyle} placeholder="e.g. 2h 30m" value={transportForm.duration} onChange={e=>setTransportForm({...transportForm,duration:e.target.value})}/>
                  </div>
                  <div>
                    <label style={labelStyle}>Price (₹)</label>
                    <input type="number" style={inputStyle} placeholder="e.g. 3500" value={transportForm.price} onChange={e=>setTransportForm({...transportForm,price:e.target.value})}/>
                  </div>
                  <div>
                    <label style={labelStyle}>Operator</label>
                    <input style={inputStyle} placeholder="e.g. IndiGo" value={transportForm.operator} onChange={e=>setTransportForm({...transportForm,operator:e.target.value})}/>
                  </div>
                  <div>
                    <label style={labelStyle}>Class</label>
                    <input style={inputStyle} placeholder="e.g. Economy" value={transportForm.class} onChange={e=>setTransportForm({...transportForm,class:e.target.value})}/>
                  </div>
                </div>
                <div style={{ display:'flex', gap:'10px', marginTop:'8px' }}>
                  <button onClick={()=>setShowTransportModal(false)} style={{ flex:1, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'10px', padding:'12px', color:'rgba(255,255,255,0.4)', fontSize:'14px', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Cancel</button>
                  <button onClick={handleAddTransport} disabled={savingTransport} style={{ flex:2, background:'linear-gradient(135deg,#ffb340,#ff6b30)', border:'none', borderRadius:'10px', padding:'12px', color:'#07070c', fontSize:'14px', fontWeight:700, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
                    {savingTransport ? 'Adding…' : '+ Add Transport'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADD HOTEL MODAL */}
      <AnimatePresence>
        {showHotelModal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={e=>e.target===e.currentTarget&&setShowHotelModal(false)}
            style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
            <motion.div initial={{ scale:0.9, opacity:0, y:20 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:0.9, opacity:0 }}
              style={{ background:'#10101a', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'24px', width:'100%', maxWidth:'500px', padding:'32px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
                <h2 style={{ fontSize:'20px', fontWeight:800 }}>Add Hotel 🏨</h2>
                <button onClick={()=>setShowHotelModal(false)} style={{ background:'rgba(255,255,255,0.06)', border:'none', borderRadius:'8px', padding:'6px', cursor:'pointer', color:'rgba(255, 255, 255, 0.5)', display:'flex' }}><X size={16}/></button>
              </div>
              <div style={{ display:'flex', gap:'10px', marginBottom:'16px' }}>
                <input style={{ ...inputStyle, flex:1 }} placeholder={`Search hotels in ${trip.destination}`} value={hotelSearch} onChange={e=>setHotelSearch(e.target.value)}/>
                <button onClick={handleSearchHotels} style={{ background:'linear-gradient(135deg,#ffb340,#ff6b30)', border:'none', borderRadius:'10px', padding:'11px 18px', color:'#07070c', fontWeight:700, fontSize:'13px', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", whiteSpace:'nowrap' }}>Search</button>
              </div>
              {hotels.length === 0 ? (
                <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'14px', textAlign:'center', padding:'30px 0' }}>Search for hotels in {trip.destination} to add them to your trip</p>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:'10px', maxHeight:'300px', overflowY:'auto' }}>
                  {hotels.map((hotel, i) => (
                    <div key={i} className="hotel-card" onClick={()=>handleAddHotel(hotel._id)}
                      style={{ background:'#13131e', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'12px', padding:'14px 16px', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', transition:'all 0.2s' }}>
                      <div>
                        <p style={{ fontWeight:600, fontSize:'14px', marginBottom:'2px' }}>{hotel.name}</p>
                        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'12px' }}>{hotel.city}</p>
                      </div>
                      {hotel.price>0 && <span style={{ color:'#6d40ff', fontWeight:700, fontSize:'14px' }}>₹{hotel.price}/night</span>}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}