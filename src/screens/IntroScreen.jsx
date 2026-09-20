export default function IntroScreen({ onStart }) {
  return (
    <main className="intro-screen">
      <div className="intro-glow intro-glow-one" />
      <div className="intro-glow intro-glow-two" />

      <div className="intro-content">
        <div className="turco-mark">ET</div>

        <p className="intro-presents">PRESENTS</p>

        <h1 className="el-turco-title">EL TURCO</h1>

        <div className="title-line" />

        <h2 className="game-title">FOOTBALL CARD WARS</h2>

        <p className="game-description">
          Kartlarını topla. Takımını kur. Ligleri fethet.
        </p>

        <button className="start-button" onClick={onStart}>
          OYUNA GİR
        </button>

        <p className="version-text">EARLY ACCESS • v0.1</p>
      </div>
    </main>
  );
}