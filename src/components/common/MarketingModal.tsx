"use client";
// Updated: 2026-11-23 - WhatsApp Support Notice Modal

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, MessageCircle, Clock, AlertCircle } from "lucide-react";

interface MarketingModalProps {
    lang: string;
}

const copy = {
    en: {
        badge: "Important Notice",
        title: "Temporary WhatsApp Support Update",
        lead: "We’re currently experiencing a temporary issue with our primary WhatsApp Business account.",
        body: "In the meantime, our sales and customer service team remains fully available to assist you without interruption through our alternative WhatsApp line.",
        boxLabel: "Alternative WhatsApp Number",
        boxSubtext: "Fast response · Official support",
        notice24h: "We expect our main WhatsApp service to be restored within 24 hours.",
        cta: "Chat on WhatsApp (+212 641-517831)",
        secondaryCta: "Continue to Website",
        signature: "Organica Group",
        thankYou: "Thank you for your understanding and continued trust!",
        whatsappMessage: "Hello! I am contacting Moroccan Organica regarding wholesale inquiry."
    },
    fr: {
        badge: "Avis Important",
        title: "Mise à jour temporaire du service WhatsApp",
        lead: "Nous rencontrons actuellement un problème technique temporaire avec notre compte WhatsApp Business principal.",
        body: "Pendant ce temps, notre équipe commerciale et support reste à votre entière disposition sans interruption via notre numéro WhatsApp alternatif.",
        boxLabel: "Numéro WhatsApp Alternatif",
        boxSubtext: "Réponse rapide · Support officiel",
        notice24h: "Le rétablissement complet de notre ligne principale est prévu d'ici 24 heures.",
        cta: "Discuter sur WhatsApp (+212 641-517831)",
        secondaryCta: "Continuer sur le site",
        signature: "Organica Group",
        thankYou: "Merci de votre compréhension et de votre confiance !",
        whatsappMessage: "Bonjour ! Je vous contacte concernant vos produits Moroccan Organica."
    },
    ar: {
        badge: "إشعار هام",
        title: "تحديث مؤقت لخدمة الواتساب",
        lead: "نواجه حالياً عطلاً تقنياً مؤقتاً في حساب واتساب للأعمال الرئيسي الخاص بنا.",
        body: "في هذه الأثناء، يواصل فريق المبيعات وخدمة العملاء استقبال طلباتكم واستفساراتكم دون انقطاع عبر رقم الواتساب البديل المعتمد.",
        boxLabel: "رقم الواتساب البديل",
        boxSubtext: "استجابة سريعة · دعم رسمي معتمد",
        notice24h: "نتوقع استعادة خدمة الواتساب الرئيسية بالكامل خلال 24 ساعة.",
        cta: "تواصل عبر واتساب (+212 641-517831)",
        secondaryCta: "متابعة تصفح الموقع",
        signature: "مجموعة أورغانيكا | Organica Group",
        thankYou: "شكراً لتفهمكم وثقتكم الدائمة بنا!",
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
        // Show after a short delay so user sees it right upon landing
        const dismissed = typeof window !== "undefined" ? sessionStorage.getItem("organica_wa_notice_dismissed") : null;
        if (!dismissed) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 1500);
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
        <>
            <div
                className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-md animate-in fade-in duration-300"
                onClick={handleClose}
            >
                <div
                    className="relative bg-white max-w-[580px] w-full rounded-3xl shadow-2xl overflow-hidden border border-amber-100 animate-in zoom-in-95 duration-300"
                    onClick={(e) => e.stopPropagation()}
                    dir={isRTL ? "rtl" : "ltr"}
                >
                    {/* Header Bar */}
                    <div className="bg-primary py-3 px-5 flex items-center justify-between relative text-white">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                <AlertCircle className="w-3.5 h-3.5 text-amber-300" />
                                {t.badge}
                            </span>
                            <span className="font-serif font-bold text-sm tracking-wide text-white/90">
                                Moroccan Organica
                            </span>
                        </div>
                        <button
                            onClick={handleClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                            aria-label="Close notice"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Image Banner */}
                    <div className="relative h-48 sm:h-56 w-full bg-[#f6f2ea] overflow-hidden shrink-0">
                        <Image
                            src="/images/notice/whatsapp-notice.jpg"
                            alt="Important Notice - WhatsApp Update"
                            fill
                            className="object-cover object-center"
                            priority
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-black/10" />
                        
                        {/* 24H Badge Overlay */}
                        <div className={`absolute bottom-3 ${isRTL ? 'right-4' : 'left-4'} bg-white/90 backdrop-blur-md border border-amber-200/80 rounded-full px-3 py-1 shadow-sm flex items-center gap-2`}>
                            <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                            <span className="text-xs font-semibold text-zinc-800">
                                {isRTL ? "استعادة الخدمة خلال 24 ساعة" : lang === "fr" ? "Rétablissement d'ici 24h" : "Expected restore: ~24h"}
                            </span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 sm:p-7 space-y-4 text-center">
                        <div>
                            <h3 className="font-serif text-xl sm:text-2xl font-bold text-zinc-900 leading-snug">
                                {t.title}
                            </h3>
                            <p className="mt-2 text-sm sm:text-base text-zinc-700 font-medium leading-relaxed">
                                {t.lead}
                            </p>
                            <p className="mt-1 text-xs sm:text-sm text-zinc-500 leading-relaxed">
                                {t.body}
                            </p>
                        </div>

                        {/* WhatsApp Alternative Highlight Box */}
                        <div 
                            onClick={openWhatsApp}
                            className="bg-emerald-50/80 border-2 border-emerald-500/30 hover:border-emerald-500 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 text-left transition-all hover:shadow-md cursor-pointer group"
                            dir={isRTL ? "rtl" : "ltr"}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                                    <MessageCircle className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                                        {t.boxLabel}
                                    </p>
                                    <p className="text-lg sm:text-xl font-bold text-zinc-900 tracking-wide font-mono">
                                        +212 641-517831
                                    </p>
                                    <p className="text-xs text-emerald-700">
                                        {t.boxSubtext}
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs bg-[#25D366] text-white font-bold px-3 py-1.5 rounded-full shadow-xs shrink-0 group-hover:bg-[#20ba5a] transition-colors">
                                {isRTL ? "تواصل الآن" : lang === "fr" ? "Écrire" : "Chat Now"}
                            </span>
                        </div>

                        {/* 24h Assurance & Signature */}
                        <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-2.5 text-xs text-amber-900 leading-normal">
                            <p className="font-medium">{t.notice24h}</p>
                            <p className="text-[11px] text-amber-700/90 mt-0.5">{t.thankYou} — <strong>{t.signature}</strong></p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                            <button
                                onClick={openWhatsApp}
                                className="w-full sm:flex-1 py-3 px-6 rounded-full font-bold text-white shadow-lg bg-[#25D366] hover:bg-[#20ba5a] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
                            >
                                <MessageCircle className="w-5 h-5 fill-current" />
                                <span>{t.cta}</span>
                            </button>
                            <button
                                onClick={handleClose}
                                className="w-full sm:w-auto py-3 px-5 rounded-full font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer text-xs sm:text-sm"
                            >
                                {t.secondaryCta}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
