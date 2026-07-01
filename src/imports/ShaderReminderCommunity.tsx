const imgShaderCanvas = "/assets/shader-canvas.png";
const imgShaderPreviewButton = "/assets/shader-btn-0.png";
const imgShaderPreviewButton1 = "/assets/shader-btn-1.png";
const imgShaderPreviewButton2 = "/assets/shader-btn-2.png";
const imgShaderPreviewButton3 = "/assets/shader-btn-3.png";

function Section() {
  return <div className="absolute left-[523.5px] size-0 top-[115.8px]" data-name="Section" />;
}

function ShaderCanvas() {
  return (
    <div className="relative rounded-[33554400px] shrink-0 size-[540px]" data-name="ShaderCanvas">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-contain pointer-events-none rounded-[33554400px] size-full" src={imgShaderCanvas} />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex flex-col items-center justify-center left-[253.3px] size-[540.391px] top-[115.8px]" data-name="Container">
      <ShaderCanvas />
    </div>
  );
}

function App() {
  return (
    <div className="absolute bg-black h-[772px] left-0 top-0 w-[1047px]" data-name="App">
      <Section />
      <Container />
    </div>
  );
}

function ShaderPreviewButton() {
  return (
    <div className="absolute left-0 rounded-[33554400px] size-[34.1px] top-0" data-name="ShaderPreviewButton">
      <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none rounded-[33554400px] size-full" src={imgShaderPreviewButton} />
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] border-2 border-solid border-white left-[-1.75px] overflow-clip rounded-[33554400px] shadow-[0px_0px_10px_0px_rgba(255,255,255,0.5)] size-[38.5px] top-[-1.75px]" data-name="Button">
      <ShaderPreviewButton />
    </div>
  );
}

function ShaderPreviewButton1() {
  return (
    <div className="absolute left-0 rounded-[33554400px] size-[31px] top-0" data-name="ShaderPreviewButton">
      <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none rounded-[33554400px] size-full" src={imgShaderPreviewButton1} />
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] border-2 border-[rgba(255,255,255,0.3)] border-solid left-0 overflow-clip rounded-[33554400px] size-[35px] top-[48.5px]" data-name="Button">
      <ShaderPreviewButton1 />
    </div>
  );
}

function ShaderPreviewButton2() {
  return (
    <div className="absolute left-0 rounded-[33554400px] size-[31px] top-0" data-name="ShaderPreviewButton">
      <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none rounded-[33554400px] size-full" src={imgShaderPreviewButton2} />
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] border-2 border-[rgba(255,255,255,0.3)] border-solid left-0 overflow-clip rounded-[33554400px] size-[35px] top-[97px]" data-name="Button">
      <ShaderPreviewButton2 />
    </div>
  );
}

function ShaderPreviewButton3() {
  return (
    <div className="absolute left-0 rounded-[33554400px] size-[31px] top-0" data-name="ShaderPreviewButton">
      <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none rounded-[33554400px] size-full" src={imgShaderPreviewButton3} />
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] border-2 border-[rgba(255,255,255,0.3)] border-solid left-0 overflow-clip rounded-[33554400px] size-[35px] top-[145.5px]" data-name="Button">
      <ShaderPreviewButton3 />
    </div>
  );
}

function ShaderSelector() {
  return (
    <div className="absolute h-[183.5px] left-[998px] top-[294.25px] w-[35px]" data-name="ShaderSelector">
      <Button />
      <Button1 />
      <Button2 />
      <Button3 />
    </div>
  );
}

export default function ShaderReminderCommunity() {
  return (
    <div className="bg-white relative size-full" data-name="Shader Reminder (Community)">
      <App />
      <ShaderSelector />
    </div>
  );
}