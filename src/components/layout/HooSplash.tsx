/**
 * 初回ローディング（スプラッシュ）画面。
 *
 * - サーバーが返す初期HTMLに含めるため、ハイドレーション前から即座にロゴが表示されます
 * - ページの読み込みが完了するとフェードアウトして消えます
 * - 同一セッション内では一度だけ表示（sessionStorage）。ページ遷移や再読込では再表示しません
 * - prefers-reduced-motion 設定時はアニメーションしません
 *
 * インラインスクリプトで表示制御するため、React管理外の変更として
 * suppressHydrationWarning を付けています。
 */

const SPLASH_SCRIPT = `(function(){
  var el = document.getElementById('hoo-splash');
  if (!el) return;
  var KEY = 'hoo-splash-shown';
  try {
    if (sessionStorage.getItem(KEY)) { el.setAttribute('hidden',''); return; }
    sessionStorage.setItem(KEY,'1');
  } catch (e) {}
  var start = Date.now();
  function remove(){ if (el) el.setAttribute('hidden',''); }
  function hide(){
    el.classList.add('is-hidden');
    el.addEventListener('transitionend', remove, { once: true });
    setTimeout(remove, 1000);
  }
  function ready(){
    var wait = Math.max(0, 650 - (Date.now() - start));
    setTimeout(hide, wait);
  }
  if (document.readyState === 'complete') ready();
  else window.addEventListener('load', ready, { once: true });
})();`;

export default function HooSplash({ label }: { label: string }) {
  return (
    <>
      <div id="hoo-splash" role="status" aria-label={label} suppressHydrationWarning>
        {/* 初期HTMLで即座に描画したいため next/image ではなく素の img を使う */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo/hoo-logo.png"
          alt=""
          width={363}
          height={193}
          className="hoo-splash-logo"
        />
      </div>
      <script
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: SPLASH_SCRIPT }}
      />
    </>
  );
}
