import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";

// Mock Data บัญชีผู้ใช้งานระบบเริ่มต้น
const INITIAL_USERS_DATABASE = [
  { username: "user01", password: "password123", name: "สมชาย ใจดี", role: "User" },
  { username: "tech01", password: "password123", name: "ช่างวิชัย (Tech 01)", role: "Technician" }
];

// Mock Data รายการอุปกรณ์
const INITIAL_EQUIPMENT = [
  { id: "EQ001", name: "Computer Desktop Dell OptiPlex", category: "Hardware", location: "Lab 101", status: "Ready" },
  { id: "EQ002", name: "Monitor LG 24 Inch", category: "Hardware", location: "Lab 102", status: "Under Repair" },
  { id: "EQ003", name: "Printer HP LaserJet Pro", category: "Peripheral", location: "Office Room", status: "Ready" },
  { id: "EQ004", name: "Cisco Router Wi-Fi 6", category: "Network", location: "Server Room", status: "Ready" }
];

// Mock Data รายการแจ้งซ่อมเริ่มต้น (เพิ่มฟิลด์ image สำหรับรูปภาพ)
const INITIAL_TICKETS = [
  { id: "TK-9021", equipmentId: "EQ002", description: "หน้าจอดับ เปิดไม่ติด มีเสียงติ๊ดยาว", priority: "High", status: "In Progress", createdAt: "2026-03-01", image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=300&q=80" },
  { id: "TK-9020", equipmentId: "EQ001", description: "ต้องการเพิ่ม RAM 16GB", priority: "Low", status: "Pending", createdAt: "2026-03-02", image: null }
];

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("it_repair_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem("it_repair_users");
    return saved ? JSON.parse(saved) : INITIAL_USERS_DATABASE;
  });

  const [equipmentList] = useState(INITIAL_EQUIPMENT);

  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem("it_repair_tickets");
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("it_repair_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("it_repair_user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("it_repair_users", JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    localStorage.setItem("it_repair_tickets", JSON.stringify(tickets));
  }, [tickets]);

  return (
    <Router>
      <div style={styles.container}>
        <NavBar user={user} setUser={setUser} />
        <main style={styles.content}>
          <Routes>
            <Route path="/" element={<Home tickets={tickets} equipmentCount={equipmentList.length} />} />
            <Route path="/equipment" element={<EquipmentList items={equipmentList} />} />
            <Route path="/report" element={<ReportIssue equipment={equipmentList} setTickets={setTickets} user={user} />} />
            <Route path="/status" element={<TrackStatus tickets={tickets} setTickets={setTickets} user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} user={user} usersList={usersList} setUsersList={setUsersList} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Navbar
function NavBar({ user, setUser }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.navbar}>
      <div style={styles.brandGroup}>
        <div style={styles.logoWrapper}>
          <img 
            src="/assets/icons/it_repair_logo.svg" 
            alt="IT Repair Logo" 
            style={{ height: "36px", width: "auto", display: "block" }} 
          />
        </div>
      </div>
      <div style={styles.navGroup}>
        <Link to="/" style={isActive("/") ? styles.navLinkActive : styles.navLink}>หน้าหลัก</Link>
        <Link to="/equipment" style={isActive("/equipment") ? styles.navLinkActive : styles.navLink}>รายการอุปกรณ์</Link>
        <Link to="/report" style={isActive("/report") ? styles.navLinkActive : styles.navLink}>แจ้งปัญหา</Link>
        <Link to="/status" style={isActive("/status") ? styles.navLinkActive : styles.navLink}>ติดตามสถานะ</Link>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={styles.userBadge}>
              <span style={styles.statusDot}></span>
              {user.name} ({user.role})
            </div>
            <button onClick={() => setUser(null)} style={styles.btnNavLogout}>ออกจากระบบ</button>
          </div>
        ) : (
          <Link to="/login" style={styles.btnLogin}>เข้าสู่ระบบ</Link>
        )}
      </div>
    </nav>
  );
}

// 1. Home Page
function Home({ tickets, equipmentCount }) {
  const pendingCount = tickets.filter(t => t.status === "Pending").length;
  const inProgressCount = tickets.filter(t => t.status === "In Progress").length;
  const recentTickets = tickets.slice(0, 3);

  return (
    <div style={styles.pageBox}>
      <div style={styles.heroBanner}>
        <div style={styles.badgeTop}>✨ Dashboard Overview</div>
        <h1 style={styles.heroTitle}>IT Repair & Tracking System</h1>
        <p style={styles.heroSubtitle}>ระบบจัดการคำขอแจ้งซ่อมไอที และติดตามสถานะแบบ Real-time</p>
        
        <div style={styles.quickActionRow}>
          <Link to="/report" style={styles.btnActionPrimary}>🔧 แจ้งซ่อมอุปกรณ์</Link>
          <Link to="/status" style={styles.btnActionSecondary}>🔍 ติดตามสถานะงาน</Link>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📦</div>
          <div>
            <div style={styles.statVal}>{equipmentCount}</div>
            <div style={styles.statLbl}>อุปกรณ์ในระบบ</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>⏳</div>
          <div>
            <div style={{ ...styles.statVal, color: "#f59e0b" }}>{pendingCount}</div>
            <div style={styles.statLbl}>รอดำเนินการ</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🛠️</div>
          <div>
            <div style={{ ...styles.statVal, color: "#38bdf8" }}>{inProgressCount}</div>
            <div style={styles.statLbl}>กำลังซ่อมแซม</div>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ ...styles.cardTitle, margin: 0 }}>⚡ รายการแจ้งซ่อมล่าสุด</h3>
          <Link to="/status" style={{ color: "#38bdf8", textDecoration: "none", fontSize: 13 }}>ดูทั้งหมด →</Link>
        </div>
        
        {recentTickets.length === 0 ? (
          <p style={{ color: "#94a3b8", fontSize: 14 }}>ไม่มีรายการแจ้งซ่อมขณะนี้</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recentTickets.map(t => (
              <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", backgroundColor: "rgba(15, 23, 42, 0.5)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <span style={{ color: "#38bdf8", fontWeight: "bold", fontSize: 12, marginRight: 8 }}>{t.id}</span>
                  <span style={{ color: "#e2e8f0", fontSize: 14 }}>{t.description}</span>
                </div>
                <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 12, backgroundColor: t.status === "In Progress" ? "rgba(245,158,11,0.2)" : "rgba(239,68,68,0.2)", color: t.status === "In Progress" ? "#fbbf24" : "#f87171" }}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>📞 IT Helpdesk Support</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14, color: "#cbd5e1" }}>
            <div>📍 <strong>สถานที่:</strong> อาคารศูนย์คอมพิวเตอร์ ชั้น 2</div>
            <div>☎️ <strong>เบอร์โทรภายใน:</strong> 1102, 1103</div>
            <div>⏰ <strong>เวลาทำการ:</strong> จันทร์ - ศุกร์ (08:30 - 16:30 น.)</div>
            <div>✉️ <strong>Email:</strong> it-support@company.ac.th</div>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>❓ คำถามที่พบบ่อย (FAQ)</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13, color: "#cbd5e1" }}>
            <div>
              <strong style={{ color: "#e2e8f0" }}>Q: ซ่อมใช้เวลานานเท่าไหร่?</strong>
              <p style={{ margin: "2px 0 0 0", color: "#94a3b8" }}>เคสทั่วไป 1-2 วันทำการ หากต้องเปลี่ยนอะไหล่ 3-5 วัน</p>
            </div>
            <div>
              <strong style={{ color: "#e2e8f0" }}>Q: ติดตามช่างได้อย่างไร?</strong>
              <p style={{ margin: "2px 0 0 0", color: "#94a3b8" }}>เช็คสถานะผ่านเมนู "ติดตามสถานะ" ในระบบได้ตลอด 24 ชม.</p>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>📌 วัตถุประสงค์ของระบบ</h3>
        <p style={styles.cardText}>
          ศูนย์กลางการรับแจ้งปัญหาอุปกรณ์ไอทีขัดข้อง อำนวยความสะดวกให้พนักงาน สามารถส่งเรื่อง ติดตามสถานะ และประเมินการบริการได้อย่างมีประสิทธิภาพสูงสุด
        </p>
        <div style={styles.onlineBadge}>
          <span style={styles.pulseGreen}></span> ระบบเปิดให้บริการแจ้งซ่อมตามปกติ
        </div>
      </div>
    </div>
  );
}

// 2. Equipment List
function EquipmentList({ items }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredItems = items.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.id.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filter === "All" || item.category === filter;
    return matchSearch && matchCategory;
  });

  return (
    <div style={styles.pageBox}>
      <div style={styles.pageHeader}>
        <h2>💻 รายการและค้นหาอุปกรณ์ (F01 & F02)</h2>
        <p style={styles.subTextHeader}>ตรวจสอบสถานะและตำแหน่งที่ตั้งของอุปกรณ์ทั้งหมดในระบบ</p>
      </div>

      <div style={styles.filterRow}>
        <input 
          type="text" 
          placeholder="🔍 ค้นหารหัส หรือ ชื่ออุปกรณ์..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          style={styles.input}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={styles.select}>
          <option value="All">ทุกหมวดหมู่</option>
          <option value="Hardware">Hardware</option>
          <option value="Peripheral">Peripheral</option>
          <option value="Network">Network</option>
        </select>
      </div>

      <div style={styles.listGrid}>
        {filteredItems.map(item => (
          <div key={item.id} style={styles.itemCard}>
            <div>
              <div style={styles.itemId}>{item.id}</div>
              <strong style={{ fontSize: 16 }}>{item.name}</strong>
              <div style={styles.subText}>📍 สถานที่: {item.location}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={styles.categoryTag}>{item.category}</span>
              <div style={{ marginTop: 8, fontSize: 12, color: item.status === "Ready" ? "#4ade80" : "#f59e0b" }}>
                ● {item.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. Report Issue Form (เพิ่มฟังก์ชันแนบรูปภาพ)
function ReportIssue({ equipment, setTickets, user }) {
  const [selectedEq, setSelectedEq] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [imagePreview, setImagePreview] = useState(null); // เพิ่ม state เก็บไฟล์รูปภาพ
  const navigate = useNavigate();

  // แปลงรูปภาพเป็น Base64 Data URL เพื่อเซฟลง LocalStorage
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("ขนาดไฟล์รูปภาพใหญ่เกินไป (กรุณาเลือกไฟล์ขนาดไม่เกิน 2MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEq || !description) return alert("กรุณากรอกข้อมูลให้ครบถ้วน");

    const newTicket = {
      id: "TK-" + Math.floor(1000 + Math.random() * 9000),
      equipmentId: selectedEq,
      description,
      priority,
      status: "Pending",
      reportedBy: user ? user.name : "Guest User",
      createdAt: new Date().toISOString().split('T')[0],
      image: imagePreview // เพิ่มฟิลด์รูปภาพใน Ticket
    };

    setTickets(prev => [newTicket, ...prev]);
    alert("ส่งใบแจ้งซ่อมสำเร็จ!");
    navigate("/status");
  };

  return (
    <div style={{ ...styles.pageBox, maxWidth: 650 }}>
      <div style={styles.pageHeader}>
        <h2>📝 ส่งใบแจ้งซ่อม (F03)</h2>
        <p style={styles.subTextHeader}>กรอกรายละเอียดปัญหาอุปกรณ์ไอทีเพื่อให้ช่างเข้าตรวจสอบ</p>
      </div>

      <form onSubmit={handleSubmit} style={styles.formCard}>
        <label style={styles.label}>ผู้แจ้งเรื่อง:</label>
        <input 
          type="text" 
          value={user ? `${user.name} (${user.role})` : "ผู้ใช้งานทั่วไป (ไม่ได้เข้าสู่ระบบ)"} 
          disabled 
          style={{ ...styles.input, backgroundColor: "rgba(15,23,42,0.9)", color: "#94a3b8" }}
        />

        <label style={styles.label}>เลือกรหัสอุปกรณ์:</label>
        <select value={selectedEq} onChange={e => setSelectedEq(e.target.value)} style={styles.input}>
          <option value="">-- เลือกอุปกรณ์ที่มีปัญหา --</option>
          {equipment.map(eq => (
            <option key={eq.id} value={eq.id}>{eq.id} - {eq.name}</option>
          ))}
        </select>

        <label style={styles.label}>อาการที่พบ / รายละเอียดปัญหา:</label>
        <textarea 
          rows="4" 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          placeholder="อธิบายอาการเสียเบื้องต้น..." 
          style={styles.input}
        />

        {/* ส่วนแนบไฟล์รูปภาพ */}
        <label style={styles.label}>📷 แนบรูปภาพประกอบอาการเสีย (ไม่บังคับ):</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
          style={{ ...styles.input, padding: "8px 12px" }}
        />

        {imagePreview && (
          <div style={{ marginTop: 10, textAlign: "center" }}>
            <p style={{ fontSize: 12, color: "#38bdf8", marginBottom: 6 }}>📷 ตัวอย่างรูปภาพที่แนบ:</p>
            <img 
              src={imagePreview} 
              alt="Preview" 
              style={{ maxHeight: 180, borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)" }} 
            />
          </div>
        )}

        <label style={styles.label}>ระดับความเร่งด่วน:</label>
        <select value={priority} onChange={e => setPriority(e.target.value)} style={styles.input}>
          <option value="Low">Low (ไม่เร่งด่วน)</option>
          <option value="Normal">Normal (ปานกลาง)</option>
          <option value="High">High (เร่งด่วนมาก)</option>
        </select>

        <button type="submit" style={styles.btnSubmit}>ส่งข้อมูลแจ้งซ่อม</button>
      </form>
    </div>
  );
}

// 4. Track Status Page (ปรับรองรับการแสดงรูปภาพแนบ)
function TrackStatus({ tickets, setTickets, user }) {
  const updateStatus = (id, newStatus) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  return (
    <div style={styles.pageBox}>
      <div style={styles.pageHeader}>
        <h2>📋 ติดตามและอัปเดตสถานะงานซ่อม (F04 & F05)</h2>
        <p style={styles.subTextHeader}>เช็คสถานะการดำเนินงานของทีมช่างแบบ Real-time</p>
      </div>

      {tickets.length === 0 ? (
        <div style={styles.emptyBox}>ยังไม่มีรายการแจ้งซ่อมในระบบ</div>
      ) : (
        <div style={styles.listGrid}>
          {tickets.map(t => (
            <div key={t.id} style={styles.itemCard}>
              <div style={{ flex: 1 }}>
                <div style={styles.ticketHeader}>
                  <span style={styles.ticketId}>{t.id}</span>
                  <span style={styles.subText}>อุปกรณ์: <strong>{t.equipmentId}</strong></span>
                </div>
                <p style={{ margin: "8px 0", color: "#e2e8f0", fontSize: 14 }}>{t.description}</p>
                
                {/* แสดงรูปภาพแนบถ้ามี */}
                {t.image && (
                  <div style={{ marginTop: 8, marginBottom: 8 }}>
                    <img 
                      src={t.image} 
                      alt="Ticket Attachment" 
                      style={{ maxHeight: 120, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)" }} 
                    />
                  </div>
                )}

                <div style={styles.subText}>
                  ผู้แจ้ง: <strong>{t.reportedBy || "สมชาย ใจดี"}</strong> | ความเร่งด่วน: <strong style={{ color: t.priority === "High" ? "#ef4444" : "#38bdf8" }}>{t.priority}</strong> | แจ้งเมื่อ: {t.createdAt}
                </div>
              </div>

              <div style={{ textAlign: "right", minWidth: 140 }}>
                <div style={{
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: 12,
                  fontWeight: "bold",
                  display: "inline-block",
                  backgroundColor: t.status === "Completed" ? "rgba(34,197,94,0.15)" : t.status === "In Progress" ? "rgba(245,158,11,0.15)" : "rgba(239,68,68,0.15)",
                  color: t.status === "Completed" ? "#4ade80" : t.status === "In Progress" ? "#fbbf24" : "#f87171",
                  border: `1px solid ${t.status === "Completed" ? "#22c55e" : t.status === "In Progress" ? "#f59e0b" : "#ef4444"}`
                }}>
                  ● {t.status}
                </div>

                {user?.role === "Technician" && (
                  <div style={{ marginTop: 10 }}>
                    <select 
                      value={t.status} 
                      onChange={(e) => updateStatus(t.id, e.target.value)}
                      style={{ ...styles.select, padding: "4px 8px", fontSize: 12 }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 5. Login & Register Form Page
function Login({ setUser, user, usersList, setUsersList }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("User");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (isRegister) {
      const isExist = usersList.some(u => u.username.toLowerCase() === username.trim().toLowerCase());
      if (isExist) {
        setErrorMsg("ชื่อผู้ใช้งานนี้ถูกใช้ไปแล้ว!");
        return;
      }

      const newUser = {
        username: username.trim(),
        password,
        name: name.trim(),
        role
      };

      setUsersList([...usersList, newUser]);
      setUser({ name: newUser.name, role: newUser.role, username: newUser.username });
      alert(`สมัครสมาชิกสำเร็จ! ต้อนรับคุณ ${newUser.name}`);
      navigate("/");
    } else {
      const foundUser = usersList.find(
        u => u.username === username.trim() && u.password === password
      );

      if (foundUser) {
        setUser({
          name: foundUser.name,
          role: foundUser.role,
          username: foundUser.username
        });
        alert(`เข้าสู่ระบบสำเร็จ! ต้อนรับคุณ ${foundUser.name}`);
        navigate("/");
      } else {
        setErrorMsg("ชื่อผู้ใช้ หรือ รหัสผ่านไม่ถูกต้อง!");
      }
    }
  };

  const autoFill = (un, pw) => {
    setIsRegister(false);
    setUsername(un);
    setPassword(pw);
  };

  return (
    <div style={{ ...styles.pageBox, maxWidth: 450 }}>
      <div style={styles.formCard}>
        <h2 style={{ textAlign: "center", margin: "0 0 6px 0" }}>
          {isRegister ? "📝 สมัครสมาชิกใหม่" : "🔐 เข้าสู่ระบบ (F06)"}
        </h2>
        <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 13, marginBottom: 20 }}>
          {isRegister ? "กรอกข้อมูลเพื่อสร้างบัญชีผู้ใช้ใหม่" : "กรุณากรอก Username และ Password เพื่อเข้าใช้งาน"}
        </p>

        {user ? (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <p style={{ fontSize: 15 }}>สถานะปัจจุบัน: <strong style={{ color: "#38bdf8" }}>{user.name} ({user.role})</strong></p>
            <button onClick={() => setUser(null)} style={styles.btnLogout}>ออกจากระบบ</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {errorMsg && (
              <div style={styles.errorBox}>
                ⚠️ {errorMsg}
              </div>
            )}

            {isRegister && (
              <>
                <div>
                  <label style={styles.label}>ชื่อ - นามสกุล:</label>
                  <input 
                    type="text" 
                    placeholder="เช่น สมชาย ใจดี"
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    style={styles.input}
                    required
                  />
                </div>

                <div>
                  <label style={styles.label}>สิทธิ์การใช้งาน (Role):</label>
                  <select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)} 
                    style={{ ...styles.input, width: "100%" }}
                  >
                    <option value="User">User (ผู้ใช้งานทั่วไป)</option>
                    <option value="Technician">Technician (ช่างซ่อม)</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label style={styles.label}>ชื่อผู้ใช้งาน (Username):</label>
              <input 
                type="text" 
                placeholder="กรอกชื่อผู้ใช้..."
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <div>
              <label style={styles.label}>รหัสผ่าน (Password):</label>
              <input 
                type="password" 
                placeholder="กรอกรหัสผ่าน..."
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <button type="submit" style={styles.btnSubmit}>
              {isRegister ? "ยืนยันการสมัครสมาชิก" : "เข้าสู่ระบบ"}
            </button>
          </form>
        )}

        {!user && (
          <p 
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMsg("");
            }} 
            style={{ textAlign: "center", marginTop: 16, cursor: "pointer", color: "#38bdf8", fontSize: 13, fontWeight: 500 }}
          >
            {isRegister ? "← มีบัญชีอยู่แล้ว? เข้าสู่ระบบ" : "ยังไม่มีบัญชี? สมัครสมาชิกที่นี่ →"}
          </p>
        )}

        <div style={styles.demoCredentialsBox}>
          <div style={{ fontSize: 12, fontWeight: "bold", color: "#38bdf8", marginBottom: 8 }}>
            💡 บัญชีสำหรับทดสอบระบบ (คลิกเพื่อเติมอัตโนมัติ):
          </div>
          <div 
            onClick={() => autoFill("user01", "password123")} 
            style={styles.credentialRow}
          >
            <span>👤 User: <strong>user01</strong></span>
            <span style={styles.codeBadge}>Pass: password123</span>
          </div>
          <div 
            onClick={() => autoFill("tech01", "password123")} 
            style={styles.credentialRow}
          >
            <span>🛠️ Tech: <strong>tech01</strong></span>
            <span style={styles.codeBadge}>Pass: password123</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MODERN UI STYLES ---
const styles = {
  container: {
    backgroundColor: "#0b0f19",
    backgroundImage: "radial-gradient(at 50% 0%, #1e293b 0%, #0b0f19 75%)",
    minHeight: "100vh",
    color: "#f8fafc",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  navbar: {
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    backdropFilter: "blur(12px)",
    padding: "0 40px",
    height: "70px",
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  brandGroup: { display: "flex", alignItems: "center", gap: 12 },
  logoWrapper: {
    backgroundColor: "#ffffff",
    padding: "6px 14px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  navGroup: { 
    display: "flex", 
    alignItems: "center", 
    gap: 8,
    marginLeft: "auto"
  },
  navLink: {
    color: "#94a3b8",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
    padding: "8px 16px",
    borderRadius: 8,
    whiteSpace: "nowrap"
  },
  navLinkActive: {
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    color: "#38bdf8",
    padding: "8px 16px",
    borderRadius: 8,
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 600,
    border: "1px solid rgba(56, 189, 248, 0.3)",
    whiteSpace: "nowrap"
  },
  btnLogin: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    padding: "8px 18px",
    borderRadius: 8,
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 600,
    boxShadow: "0 2px 10px rgba(59,130,246,0.3)",
    whiteSpace: "nowrap"
  },
  btnNavLogout: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    color: "#f87171",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
    whiteSpace: "nowrap"
  },
  userBadge: {
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "6px 14px",
    borderRadius: 20,
    fontSize: 13,
    color: "#e2e8f0",
    display: "flex",
    alignItems: "center",
    gap: 8,
    whiteSpace: "nowrap"
  },
  statusDot: { width: 8, height: 8, borderRadius: "50%", backgroundColor: "#22c55e" },
  content: { padding: "40px 20px", maxWidth: 1000, margin: "0 auto" },
  pageBox: { display: "flex", flexDirection: "column", gap: 24, margin: "0 auto" },
  pageHeader: { marginBottom: 8 },
  subTextHeader: { color: "#94a3b8", fontSize: 14, marginTop: 4 },
  heroBanner: {
    textAlign: "center",
    padding: "36px 20px",
    background: "linear-gradient(180deg, rgba(30,41,59,0.5) 0%, rgba(15,23,42,0.3) 100%)",
    borderRadius: 16,
    border: "1px solid rgba(255, 255, 255, 0.08)",
  },
  badgeTop: {
    display: "inline-block",
    backgroundColor: "rgba(56, 189, 248, 0.1)",
    color: "#38bdf8",
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 12
  },
  heroTitle: { fontSize: 32, fontWeight: 800, margin: "0 0 8px 0", letterSpacing: -0.5 },
  heroSubtitle: { color: "#94a3b8", fontSize: 15, margin: 0 },
  quickActionRow: { display: "flex", justifyContent: "center", gap: 12, marginTop: 20 },
  btnActionPrimary: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: 10,
    textDecoration: "none",
    fontWeight: 600,
    fontSize: 14,
    boxShadow: "0 4px 14px rgba(59,130,246,0.3)"
  },
  btnActionSecondary: {
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    color: "#e2e8f0",
    padding: "10px 20px",
    borderRadius: 10,
    textDecoration: "none",
    fontWeight: 600,
    fontSize: 14,
    border: "1px solid rgba(255, 255, 255, 0.1)"
  },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 },
  statCard: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: 14,
    padding: 20,
    display: "flex",
    alignItems: "center",
    gap: 16
  },
  statIcon: { fontSize: 28, width: 48, height: 48, borderRadius: 12, backgroundColor: "rgba(15,23,42,0.6)", display: "flex", alignItems: "center", justifyContent: "center" },
  statVal: { fontSize: 24, fontWeight: 800 },
  statLbl: { color: "#94a3b8", fontSize: 13 },
  card: {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: 14,
    padding: 24
  },
  cardTitle: { margin: "0 0 12px 0", color: "#38bdf8", fontSize: 18 },
  cardText: { color: "#cbd5e1", margin: 0, lineHeight: 1.6, fontSize: 14 },
  onlineBadge: { marginTop: 16, color: "#4ade80", fontSize: 13, display: "flex", alignItems: "center", gap: 8 },
  pulseGreen: { width: 8, height: 8, borderRadius: "50%", backgroundColor: "#22c55e", boxShadow: "0 0 8px #22c55e" },
  filterRow: { display: "flex", gap: 12 },
  input: {
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: 10,
    width: "100%",
    outline: "none",
    boxSizing: "border-box"
  },
  select: {
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: 10,
    outline: "none"
  },
  listGrid: { display: "flex", flexDirection: "column", gap: 12 },
  itemCard: {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    padding: 18,
    display: "flex",
    justifySpace: "space-between",
    alignItems: "center"
  },
  itemId: { color: "#38bdf8", fontSize: 12, fontWeight: 700, marginBottom: 2 },
  subText: { fontSize: 13, color: "#94a3b8", marginTop: 4 },
  categoryTag: { backgroundColor: "rgba(51, 65, 85, 0.8)", color: "#cbd5e1", padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 500 },
  formCard: {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: 14,
    padding: 24,
    display: "flex",
    flexDirection: "column",
    gap: 12
  },
  label: { fontSize: 13, color: "#cbd5e1", fontWeight: 500, marginBottom: 2, display: "block" },
  btnSubmit: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "12px",
    borderRadius: 10,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 6,
    boxShadow: "0 4px 12px rgba(59,130,246,0.3)"
  },
  emptyBox: { textAlign: "center", padding: 40, color: "#64748b", backgroundColor: "rgba(30,41,59,0.3)", borderRadius: 12 },
  ticketHeader: { display: "flex", alignItems: "center", gap: 10 },
  ticketId: { backgroundColor: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", padding: "2px 8px", borderRadius: 4, fontWeight: 700, fontSize: 12 },
  btnLogout: { backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#f87171", border: "1px solid #ef4444", padding: "8px 16px", borderRadius: 8, cursor: "pointer", marginTop: 12 },
  errorBox: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    color: "#f87171",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    padding: "10px",
    borderRadius: 8,
    fontSize: 13,
    textAlign: "center"
  },
  demoCredentialsBox: {
    marginTop: 20,
    paddingTop: 16,
    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
    display: "flex",
    flexDirection: "column",
    gap: 8
  },
  credentialRow: {
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    padding: "8px 12px",
    borderRadius: 8,
    fontSize: 12,
    color: "#cbd5e1",
    display: "flex",
    justifySpace: "space-between",
    alignItems: "center",
    cursor: "pointer",
    border: "1px solid transparent",
  },
  codeBadge: {
    backgroundColor: "rgba(51, 65, 85, 0.6)",
    color: "#94a3b8",
    padding: "2px 6px",
    borderRadius: 4,
    fontFamily: "monospace"
  }
};