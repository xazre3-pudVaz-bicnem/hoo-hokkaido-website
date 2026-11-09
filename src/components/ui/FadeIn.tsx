"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

/**
 * スクロール時に下からふわりと現れる汎用ラッパー。
 *
 * prefers-reduced-motion（動きを減らす）設定時は、globals.css の [data-fade-in] の指定で
 * 最初から表示する。以前は useReducedMotion() で別の要素に切り替えていたが、
 * サーバーの描画（透明の初期状態）とブラウザ側の描画が食い違い、React がサーバー側の
 * 透明スタイルを残すため、その設定の利用者には中身が見えなくなっていた。
 * 常に同じ要素を出し、表示の切り替えは CSS に任せる。
 */
export default function FadeIn({ children, delay = 0, className }: FadeInProps) {
  return (
    <motion.div
      data-fade-in=""
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
