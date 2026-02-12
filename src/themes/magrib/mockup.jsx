import React, { useState, useEffect } from 'react';
import {
    Search, Moon, Sun, Menu, X, ArrowRight,
    ArrowLeft, Github, Twitter, Instagram,
    User, Calendar, Clock, ChevronRight,
    Flame, Trees, Map, Compass
} from 'lucide-react';

/**
 * THEME: Bagas Magrin (Obsidian Ember)
 * DESCRIPTION: A lightweight, ultra-elegant theme for nature lovers.
 * DESIGN SYSTEM: Minimalist Serif, Twilight Palette, Campfire Accents.
 */

const App = () => {
    const [darkMode, setDarkMode] = useState(true);
    const [currentView, setCurrentView] = useState('home'); // home, single, search, 404
    const [mobileMenu, setMobileMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Ikon Bagas Minimalis (Custom SVG)
    const BagasLogo = ({ className = "w-8 h-8" }) => (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M20 50C20 35 35 25 50 25C65 25 80 35 80 50C80 65 65 75 50 75C35 75 20 65 20 50Z" fill="currentColor" fillOpacity="0.1" />
            <path d="M45 25L35 15M55 25L65 15" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <path d="M25 60L15 65M75 60L85 65" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <circle cx="40" cy="45" r="3" fill="currentColor" />
            <circle cx="60" cy="45" r="3" fill="currentColor" />
            <path d="M48 65H52M45 60H55" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
    );

    const siteData = {
        title: "Bagas Magrin",
        tagline: "Esensi Liar di Bawah Langit Senja",
        menus: {
            primary: ["Beranda", "Ekspedisi", "Jurnal", "Tentang"],
            footer: ["Privasi", "Ketentuan", "Kontak"]
        }
    };

    const featured = {
        title: "Filosofi Kesunyian: Mengapa Magrin Begitu Magis?",
        excerpt: "Sebuah perjalanan batin di tengah rimba saat matahari mulai tenggelam dan Bagas mulai memunculkan diri di antara bayang-bayang pohon pinus.",
        category: "Kontemplasi",
        author: "Arinadi",
        date: "28 November 2025",
        image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&q=80&w=1200",
        tags: ["Nature", "Twilight", "Philosophy"]
    };

    const posts = [
        {
            title: "Rahasia Api Unggun Abadi",
            category: "Survival",
            author: "Budi Rimba",
            date: "Oct 25, 2023",
            image: "https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?auto=format&fit=crop&q=80&w=600",
            excerpt: "Cara menyusun kayu agar api tetap menyala stabil sepanjang malam Magrin."
        },
        {
            title: "Jejak Bagas di Tanah Lembab",
            category: "Fauna",
            author: "Siti Alam",
            date: "Oct 12, 2023",
            image: "https://images.unsplash.com/photo-1581281863883-2469417a1668?auto=format&fit=crop&q=80&w=600",
            excerpt: "Mengenali rute perjalanan babi hutan melalui sisa jejak di tepian sungai."
        },
        {
            title: "Kopi, Bara, dan Bintang",
            category: "Life",
            author: "Arinadi",
            date: "Oct 05, 2023",
            image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600",
            excerpt: "Kenikmatan menyeduh kopi di atas bara api saat rasi bintang mulai terlihat."
        }
    ];

    // UI Components
    const NavItem = ({ label, active }) => (
        <a
            onClick={() => label === "Beranda" ? setCurrentView('home') : null}
            className={`text-xs uppercase tracking-[0.2em] font-semibold cursor-pointer transition-colors duration-300 ${active ? 'text-orange-500' : 'hover:text-orange-500 opacity-80 hover:opacity-100'}`}
        >
            {label}
        </a>
    );

    const Header = () => (
        <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? (darkMode ? 'bg-[#0c0c0e]/90 border-b border-white/5' : 'bg-white/90 border-b border-black/5') : 'bg-transparent'} backdrop-blur-md`}>
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('home')}>
                    <BagasLogo className={`w-8 h-8 ${darkMode ? 'text-orange-500' : 'text-orange-600'}`} />
                    <h1 className="font-serif text-xl font-bold tracking-tight">{siteData.title}</h1>
                </div>

                <nav className="hidden md:flex items-center space-x-10">
                    {siteData.menus.primary.map(item => <NavItem key={item} label={item} active={item === "Beranda" && currentView === "home"} />)}
                </nav>

                <div className="flex items-center space-x-4">
                    <button onClick={() => setCurrentView('search')} className="p-2 hover:text-orange-500 transition-colors">
                        <Search size={18} />
                    </button>
                    <button onClick={() => setDarkMode(!darkMode)} className="p-2 hover:text-orange-500 transition-colors">
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <button className="md:hidden p-2" onClick={() => setMobileMenu(!mobileMenu)}>
                        {mobileMenu ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenu && (
                <div className={`md:hidden absolute w-full p-6 space-y-4 border-b ${darkMode ? 'bg-[#0c0c0e] border-white/5' : 'bg-white border-black/5'}`}>
                    {siteData.menus.primary.map(item => (
                        <a key={item} className="block text-sm uppercase tracking-widest font-bold py-2" onClick={() => { if (item === "Beranda") setCurrentView('home'); setMobileMenu(false) }}>{item}</a>
                    ))}
                </div>
            )}
        </header>
    );

    const Footer = () => (
        <footer className={`py-20 border-t ${darkMode ? 'bg-[#08080a] border-white/5' : 'bg-stone-50 border-black/5'}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-3 mb-6">
                            <BagasLogo className="w-8 h-8 text-orange-500" />
                            <h2 className="font-serif text-2xl font-bold">{siteData.title}</h2>
                        </div>
                        <p className="max-w-md opacity-60 leading-relaxed text-sm mb-6">
                            {siteData.tagline}. Ruang berbagi untuk mereka yang merayakan keheningan malam dan pendar api di tengah belantara.
                        </p>
                        <div className="flex space-x-5 opacity-40">
                            <Twitter size={20} className="hover:text-orange-500 cursor-pointer transition-colors" />
                            <Instagram size={20} className="hover:text-orange-500 cursor-pointer transition-colors" />
                            <Github size={20} className="hover:text-orange-500 cursor-pointer transition-colors" />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xs uppercase tracking-[0.3em] font-bold mb-6 opacity-30">Eksplorasi</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            {siteData.menus.primary.map(item => <li key={item} className="opacity-60 hover:opacity-100 hover:text-orange-500 transition-all cursor-pointer">{item}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs uppercase tracking-[0.3em] font-bold mb-6 opacity-30">Informasi</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            {siteData.menus.footer.map(item => <li key={item} className="opacity-60 hover:opacity-100 hover:text-orange-500 transition-all cursor-pointer">{item}</li>)}
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center opacity-30 text-[10px] uppercase tracking-[0.2em] font-bold">
                    <p>© 2026 {siteData.title}. Crafted for the wild ones.</p>
                    <p className="mt-4 md:mt-0">Lightweight & Elegant by Design</p>
                </div>
            </div>
        </footer>
    );

    const HomeView = () => (
        <div className="animate-in fade-in duration-700">
            {/* Hero Featured */}
            <section className="relative h-[85vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src={featured.image} className="w-full h-full object-cover opacity-60 scale-105" alt="Featured" />
                    <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-t from-[#0c0c0e] via-transparent to-[#0c0c0e]/40' : 'bg-gradient-to-t from-white via-transparent to-white/40'}`}></div>
                </div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                    <div className="max-w-2xl">
                        <span className="inline-block px-3 py-1 mb-6 text-[10px] uppercase tracking-[0.3em] font-extrabold bg-orange-500 text-white">
                            {featured.category}
                        </span>
                        <h2 className="font-serif text-5xl md:text-7xl font-bold leading-[1.1] mb-6 cursor-pointer hover:text-orange-400 transition-colors" onClick={() => setCurrentView('single')}>
                            {featured.title}
                        </h2>
                        <p className="text-lg opacity-70 mb-8 leading-relaxed line-clamp-2">
                            {featured.excerpt}
                        </p>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/20">
                                    <User size={14} className="text-orange-500" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest">{featured.author}</span>
                            </div>
                            <span className="opacity-20">•</span>
                            <span className="text-xs opacity-60 uppercase tracking-widest">{featured.date}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Post Grid */}
            <section className="max-w-7xl mx-auto px-6 py-24">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <span className="text-orange-500 text-xs font-black uppercase tracking-[0.4em] mb-2 block">Journal</span>
                        <h3 className="font-serif text-3xl font-bold">Terbaru dari Rimba</h3>
                    </div>
                    <button className="text-xs font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity flex items-center group">
                        Lihat Semua <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {posts.map((post, idx) => (
                        <article key={idx} className="group cursor-pointer" onClick={() => setCurrentView('single')}>
                            <div className="relative overflow-hidden mb-6 aspect-[16/10] bg-stone-900">
                                <img src={post.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" alt={post.title} />
                                <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/10 transition-colors duration-500"></div>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-3 block">{post.category}</span>
                            <h4 className="font-serif text-xl font-bold mb-3 group-hover:text-orange-500 transition-colors leading-snug">{post.title}</h4>
                            <p className="text-sm opacity-60 leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
                            <div className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest opacity-40">
                                <span>{post.author}</span>
                                <span>•</span>
                                <span>{post.date}</span>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );

    const SingleView = () => (
        <div className="animate-in slide-in-from-bottom-4 duration-700">
            <div className="h-[60vh] relative">
                <img src={featured.image} className="w-full h-full object-cover grayscale-[30%]" alt="Hero" />
                <div className={`absolute inset-0 ${darkMode ? 'bg-black/40' : 'bg-black/20'}`}></div>
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-32 relative z-10">
                <div className={`p-8 md:p-16 ${darkMode ? 'bg-[#0c0c0e] border border-white/5' : 'bg-white shadow-2xl'} mb-20`}>
                    <button onClick={() => setCurrentView('home')} className="mb-10 text-xs font-bold uppercase tracking-widest opacity-40 hover:opacity-100 flex items-center transition-all">
                        <ArrowLeft size={14} className="mr-2" /> Kembali ke Beranda
                    </button>

                    <span className="text-orange-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Ekspedisi</span>
                    <h1 className="font-serif text-4xl md:text-6xl font-bold mb-8 leading-tight">{featured.title}</h1>

                    <div className="flex items-center space-x-6 pb-12 border-b border-white/5 mb-12">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">A</div>
                            <span className="text-xs font-bold uppercase tracking-widest">{featured.author}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs opacity-40 font-bold uppercase tracking-widest">
                            <Calendar size={12} />
                            <span>{featured.date}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs opacity-40 font-bold uppercase tracking-widest">
                            <Clock size={12} />
                            <span>12 Menit Membaca</span>
                        </div>
                    </div>

                    <article className={`prose prose-lg max-w-none ${darkMode ? 'prose-invert' : ''} font-serif leading-relaxed opacity-90`}>
                        <p className="text-xl italic opacity-70 mb-10 leading-relaxed">
                            "Di antara bayang-bayang pohon pinus yang memanjang, ada sebuah dunia yang hanya terbangun saat cahaya mulai padam. Itulah saat Bagas menunjukkan kedaulatannya."
                        </p>
                        <p>Hutan Maghrib bukanlah tempat untuk mereka yang terburu-buru. Ia menuntut kesabaran. Saat kita duduk diam di depan api unggun yang baru saja menyala, suara-suara alam mulai berubah. Kicauan burung siang berganti dengan gesekan daun yang misterius.</p>

                        <h2 className="text-orange-500 mt-12 mb-6">Momen Krusial Magrin</h2>
                        <p>Ada jeda sekitar 15 menit ketika langit berubah dari biru tua menjadi obsidian. Inilah momen di mana adrenalin dan kedamaian bertemu secara anomali. Para pendaki menyebutnya sebagai 'Waktu Bagas'.</p>

                        <div className="my-12 p-8 border-l-4 border-orange-500 bg-orange-500/5 italic text-lg leading-relaxed">
                            "Api bukan sekadar penghangat, ia adalah pusat gravitasi dari segala cerita yang tak pernah berani kita ucapkan di bawah terik matahari."
                        </div>

                        <p>Menghadapi babi hutan atau Bagas di waktu-waktu ini memerlukan ketenangan. Mereka tidak mencari masalah, mereka hanya berbagi ruang yang sama dengan kita. Kuncinya adalah rasa hormat.</p>

                        <img src="https://images.unsplash.com/photo-1445308306294-bfc3f79a2456?auto=format&fit=crop&q=80&w=1000" className="w-full my-12" alt="Nature" />

                        <div className="mt-16 pt-8 border-t border-white/5">
                            <div className="flex flex-wrap gap-3">
                                {featured.tags.map(tag => (
                                    <span key={tag} className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest bg-stone-500/10 rounded-full">#{tag}</span>
                                ))}
                            </div>
                        </div>
                    </article>

                    {/* Discussion */}
                    <div className="mt-24 pt-12 border-t border-white/5">
                        <h3 className="font-serif text-2xl font-bold mb-8">Diskusi Rimba</h3>
                        <div className={`p-10 rounded-xl border border-dashed ${darkMode ? 'border-white/10' : 'border-black/10'} text-center opacity-40`}>
                            <p className="text-sm font-bold uppercase tracking-widest">Komentar Giscus Sedang Dimuat...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const SearchView = () => (
        <div className="max-w-4xl mx-auto px-6 py-40 min-h-[70vh] animate-in fade-in duration-500">
            <div className="mb-16">
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-orange-500 mb-4">Search Results</h2>
                <div className="relative">
                    <input
                        autoFocus
                        type="text"
                        placeholder="Cari petualangan..."
                        className={`w-full text-4xl md:text-6xl font-serif font-bold bg-transparent border-b-2 outline-none pb-4 ${darkMode ? 'border-white/10 focus:border-orange-500' : 'border-black/10 focus:border-orange-500'}`}
                    />
                    <Search className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20" size={32} />
                </div>
                <p className="mt-6 opacity-40 font-bold uppercase tracking-widest text-xs">Menampilkan 2 hasil untuk "Bagas"</p>
            </div>

            <div className="space-y-12">
                {posts.slice(0, 2).map((post, i) => (
                    <div key={i} className="group flex flex-col md:flex-row gap-8 items-center cursor-pointer" onClick={() => setCurrentView('single')}>
                        <div className="w-full md:w-48 aspect-square overflow-hidden shrink-0">
                            <img src={post.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="Res" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-2 block">{post.category}</span>
                            <h3 className="font-serif text-2xl font-bold mb-3 group-hover:text-orange-500 transition-colors">{post.title}</h3>
                            <p className="opacity-60 text-sm line-clamp-2">{post.excerpt}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const NotFoundView = () => (
        <div className="h-screen flex flex-col items-center justify-center text-center px-6">
            <h1 className="font-serif text-[12rem] leading-none opacity-5 font-bold absolute pointer-events-none">404</h1>
            <div className="relative z-10">
                <BagasLogo className="w-24 h-24 mx-auto mb-8 text-orange-500 opacity-20" />
                <h2 className="font-serif text-4xl font-bold mb-4">Tersesat di Kabut Magrin?</h2>
                <p className="max-w-md opacity-60 mb-10 mx-auto">Jalan setapak yang Anda cari telah tertutup rimbunnya hutan. Mari kembali ke perapian sebelum malam benar-benar gelap.</p>
                <button
                    onClick={() => setCurrentView('home')}
                    className="px-10 py-4 bg-orange-500 text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-orange-600 transition-colors shadow-xl shadow-orange-500/20"
                >
                    Kembali ke Beranda
                </button>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen transition-colors duration-700 ${darkMode ? 'bg-[#0c0c0e] text-stone-100' : 'bg-stone-50 text-stone-900'}`}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@400;700;900&display=swap');
        .font-serif { font-family: 'Crimson Pro', serif; }
        body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
        .prose h1, .prose h2, .prose h3 { font-family: 'Crimson Pro', serif; }
      `}</style>

            {currentView !== '404' && <Header />}

            <main>
                {currentView === 'home' && <HomeView />}
                {currentView === 'single' && <SingleView />}
                {currentView === 'search' && <SearchView />}
                {currentView === '404' && <NotFoundView />}
            </main>

            {currentView !== '404' && <Footer />}
        </div>
    );
};

export default App;