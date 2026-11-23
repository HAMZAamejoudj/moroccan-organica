"use client";
// Updated: 2026-11-23 - WhatsApp Support Notice Modal with Official Icon & Compact Design

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Clock, AlertCircle } from "lucide-react";

interface MarketingModalProps {
    lang: string;
}

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className={className}
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
    );
}

const copy = {
    en: {
        badge: "Important Notice",
        title: "Temporary WhatsApp Support Update",
        lead: "We’re currently experiencing a temporary issue with our primary WhatsApp Business account.",
        body: "In the meantime, our sales & support team is available without interruption on our alternative WhatsApp line.",
        boxLabel: "Alternative WhatsApp Support",
        boxSubtext: "Fast response · Official customer service",
        notice24h: "We expect our main WhatsApp service to be restored within 24 hours.",
        cta: "Chat on WhatsApp",
        secondaryCta: "Continue to Website",
        signature: "Organica Group",
        thankYou: "Thank you for your understanding!",
        whatsappMessage: "Hello! I am contacting Moroccan Organica regarding wholesale inquiry."
    },
    fr: {
        badge: "Avis Important",
        title: "Mise à jour temporaire du service WhatsApp",
        lead: "Nous rencontrons actuellement un incident temporaire avec notre compte WhatsApp Business principal.",
        body: "Pendant ce temps, notre équipe commerciale reste joignable sans interruption sur notre numéro alternatif.",
        boxLabel: "Numéro WhatsApp Alternatif",
        boxSubtext: "Réponse rapide · Support officiel",
        notice24h: "Rétablissement de notre ligne principale prévu d'ici 24 heures.",
        cta: "Discuter sur WhatsApp",
        secondaryCta: "Continuer sur le site",
        signature: "Organica Group",
        thankYou: "Merci de votre compréhension !",
        whatsappMessage: "Bonjour ! Je vous contacte concernant vos produits Moroccan Organica."
    },
    ar: {
        badge: "إشعار هام",
        title: "تحديث مؤقت لخدمة الواتساب",
        lead: "نواجه حالياً عطلاً تقنياً مؤقتاً في حساب واتساب للأعمال الرئيسي الخاص بنا.",
        body: "في هذه الأثناء، يواصل فريقنا استقبال طلباتكم واستفساراتكم دون انقطاع عبر رقم الواتساب البديل المعتمد.",
        boxLabel: "رقم الواتساب البديل للدعم",
        boxSubtext: "استجابة سريعة · دعم رسمي معتمد",
        notice24h: "نتوقع استعادة خدمة الواتساب الرئيسية بالكامل خلال 24 ساعة.",
        cta: "تواصل عبر واتساب",
        secondaryCta: "متابعة تصفح الموقع",
        signature: "مجموعة أورغانيكا | Organica Group",
        thankYou: "شكراً لتفهمكم وثقتكم بنا!",
        whatsappMessage: "مرحباً، أود التواصل بخصوص منتجات Moroccan Organica."
    }
} as const;

type LangKey = keyof typeof copy;

export function MarketingModal({ lang }: MarketingModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const isRTL = lang === "ar";
    const t = copy[(lang as LangKey)] || copy.en;

    const phoneNumber = "212641517831";

    const openWhatsApp = () => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(t.whatsappMessage)}`;
        window.open(url, "_blank");
        handleClose();
    };

    useEffect(() => {
        const dismissed = typeof window !== "undefined" ? sessionStorage.getItem("organica_wa_notice_dismissed") : null;
        if (!dismissed) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 1200);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        if (typeof window !== "undefined") {
            sessionStorage.setItem("organica_wa_notice_dismissed", "true");
        }
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={handleClose}
        >
            <div
                className="relative bg-white max-w-[500px] w-full rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-emerald-100/80 animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
                dir={isRTL ? "rtl" : "ltr"}
            >
                {/* Header Bar */}
                <div className="bg-primary py-2.5 px-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            <AlertCircle className="w-3 h-3 text-amber-300" />
                            {t.badge}
                        </span>
                        <span className="font-serif font-bold text-xs sm:text-sm tracking-wide text-white/90">
                            Moroccan Organica
                        </span>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                        aria-label="Close notice"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Image Banner */}
                <div className="relative h-40 sm:h-44 w-full bg-[#f6f2ea] overflow-hidden shrink-0">
                    <Image
                        src="/images/notice/whatsapp-notice.jpg"
                        alt="WhatsApp Support Notice"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-black/10" />
                    
                    {/* 24H Badge Overlay */}
                    <div className={`absolute bottom-2.5 ${isRTL ? 'right-3' : 'left-3'} bg-white/95 backdrop-blur-md border border-amber-200/90 rounded-full px-2.5 py-0.5 shadow-sm flex items-center gap-1.5`}>
                        <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                        <span className="text-[11px] font-semibold text-zinc-800">
                            {isRTL ? "استعادة الخدمة خلال 24 ساعة" : lang === "fr" ? "Rétablissement d'ici 24h" : "Expected restore: ~24h"}
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-4 sm:p-5 space-y-3 text-center">
                    <div>
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-zinc-900 leading-snug">
                            {t.title}
                        </h3>
                        <p className="mt-1 text-xs sm:text-sm text-zinc-700 font-medium leading-relaxed">
                            {t.lead}
                        </p>
                        <p className="text-[11px] sm:text-xs text-zinc-500 leading-relaxed mt-0.5">
                            {t.body}
                        </p>
                    </div>

                    {/* WhatsApp Alternative Highlight Box */}
                    <div 
                        onClick={openWhatsApp}
                        className="bg-emerald-50/70 hover:bg-emerald-50 border border-emerald-400/40 hover:border-emerald-500 rounded-xl p-3 flex items-center justify-between gap-3 transition-all hover:shadow-md cursor-pointer group"
                        dir={isRTL ? "rtl" : "ltr"}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0">
                                <WhatsAppIcon className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                                    {t.boxLabel}
                                </p>
                                <p className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight font-mono">
                                    +212 641-517831
                                </p>
                                <p className="text-[11px] text-emerald-700/90 hidden sm:block">
                                    {t.boxSubtext}
                                </p>
                            </div>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-xs bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold px-3 py-1.5 rounded-full shadow-xs shrink-0 transition-colors">
                            <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                            <span>{isRTL ? "دردشة" : lang === "fr" ? "Écrire" : "Chat Now"}</span>
                        </span>
                    </div>

                    {/* 24h Assurance & Signature */}
                    <div className="bg-amber-50/70 border border-amber-200/60 rounded-lg p-2 text-center">
                        <p className="text-xs font-medium text-amber-900">{t.notice24h}</p>
                        <p className="text-[10px] text-amber-700/90 mt-0.5">
                            {t.thankYou} — <strong>{t.signature}</strong>
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="pt-1 flex flex-col items-center gap-1.5">
                        <button
                            onClick={openWhatsApp}
                            className="w-full sm:w-auto min-w-[260px] py-2.5 px-6 rounded-full font-bold text-white shadow-md bg-[#25D366] hover:bg-[#20BA5A] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base hover:shadow-lg"
                        >
                            <WhatsAppIcon className="w-5 h-5 text-white" />
                            <span>{t.cta}</span>
                        </button>
                        <button
                            onClick={handleClose}
                            className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer py-1"
                        >
                            {t.secondaryCta}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
