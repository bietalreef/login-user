import svgPaths from "./svg-a8085e82po";
const imgImageUser = "/assets/user-placeholder.png";

function Container() {
  return <div className="absolute bg-[rgba(42,166,118,0.08)] blur-[100px] left-[175.77px] rounded-[49888100px] size-[255.982px] top-[-85.19px]" data-name="Container" />;
}

function Container1() {
  return <div className="absolute bg-[rgba(212,175,55,0.06)] blur-[80px] left-[-39.24px] rounded-[49888100px] size-[191.981px] top-[745.13px]" data-name="Container" />;
}

function Text() {
  return (
    <div className="absolute h-[14.984px] left-[5.18px] top-[52.99px] w-[29.619px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[15px] left-[15px] not-italic text-[#6a7282] text-[10px] text-center top-[-0.97px]" dir="auto">
        موصى
      </p>
    </div>
  );
}

function Container3() {
  return <div className="absolute bg-[rgba(59,122,232,0.35)] blur-[5px] h-[4.995px] left-[4px] rounded-[49888100px] top-[42px] w-[31.989px]" data-name="Container" />;
}

function Container4() {
  return (
    <div className="absolute left-0 rounded-[10px] shadow-[0px_3px_0px_0px_#2a5db8,0px_5px_7px_0px_rgba(59,122,232,0.35)] size-[39.98px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(91, 156, 246) 0%, rgb(59, 122, 232) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container5() {
  return <div className="absolute h-[13.985px] left-[3px] rounded-bl-[5px] rounded-br-[10px] rounded-tl-[10px] rounded-tr-[5px] top-[3px] w-[15.983px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 15.983 13.985\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(0 -1.3844 -1.5822 0 4.7949 4.1955)\'><stop stop-color=\'rgba(255,255,255,0.45)\' offset=\'0\'/><stop stop-color=\'rgba(191,191,191,0.3375)\' offset=\'0.175\'/><stop stop-color=\'rgba(128,128,128,0.225)\' offset=\'0.35\'/><stop stop-color=\'rgba(64,64,64,0.1125)\' offset=\'0.525\'/><stop stop-color=\'rgba(0,0,0,0)\' offset=\'0.7\'/></radialGradient></defs></svg>')" }} />;
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[19.979px]" data-name="Icon">
      <div className="absolute inset-[-10.85%_-15.15%_-20.86%_-15.85%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.1722 26.3137">
          <g clipPath="url(#clip0_2159_1105)" filter="url(#filter0_d_2159_1105)" id="Icon">
            <path d={svgPaths.p12036200} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66488" />
            <path d="M8.99465 10.492V20.4813" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66488" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="27.9786" id="filter0_d_2159_1105" width="27.9786" x="-0.832443" y="-0.832442">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2159_1105" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2159_1105" mode="normal" result="shape" />
            </filter>
            <clipPath id="clip0_2159_1105">
              <rect fill="white" height="19.9786" transform="translate(3.16756 2.16756)" width="19.9786" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.023px] size-[39.98px] top-0" data-name="Container">
      <Icon />
    </div>
  );
}

function Icon3D() {
  return (
    <div className="absolute h-[46.996px] left-0 top-0 w-[39.98px]" data-name="Icon3D">
      <Container3 />
      <Container4 />
      <Container5 />
      <Container6 />
    </div>
  );
}

function Button() {
  return (
    <div className="h-[67.974px] opacity-60 relative shrink-0 w-[39.98px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text />
        <Icon3D />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute h-[14.984px] left-[6.25px] top-[52.99px] w-[27.482px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[15px] left-[14px] not-italic text-[#6a7282] text-[10px] text-center top-[-0.97px]" dir="auto">
        المميز
      </p>
    </div>
  );
}

function Container7() {
  return <div className="absolute bg-[rgba(59,122,232,0.35)] blur-[5px] h-[4.995px] left-[4px] rounded-[49888100px] top-[42px] w-[31.989px]" data-name="Container" />;
}

function Container8() {
  return (
    <div className="absolute left-0 rounded-[10px] shadow-[0px_3px_0px_0px_#2a5db8,0px_5px_7px_0px_rgba(59,122,232,0.35)] size-[39.98px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(91, 156, 246) 0%, rgb(59, 122, 232) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container9() {
  return <div className="absolute h-[13.985px] left-[3px] rounded-bl-[5px] rounded-br-[10px] rounded-tl-[10px] rounded-tr-[5px] top-[3px] w-[15.983px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 15.983 13.985\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(0 -1.3844 -1.5822 0 4.7949 4.1955)\'><stop stop-color=\'rgba(255,255,255,0.45)\' offset=\'0\'/><stop stop-color=\'rgba(191,191,191,0.3375)\' offset=\'0.175\'/><stop stop-color=\'rgba(128,128,128,0.225)\' offset=\'0.35\'/><stop stop-color=\'rgba(64,64,64,0.1125)\' offset=\'0.525\'/><stop stop-color=\'rgba(0,0,0,0)\' offset=\'0.7\'/></radialGradient></defs></svg>')" }} />;
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[19.979px]" data-name="Icon">
      <div className="absolute inset-[-10.85%_0_-20.86%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9786 26.3132">
          <g clipPath="url(#clip0_2159_1178)" filter="url(#filter0_d_2159_1178)" id="Icon">
            <path d={svgPaths.p590b580} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66488" />
            <path d={svgPaths.p26f601f0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66488" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="27.9786" id="filter0_d_2159_1178" width="27.9786" x="-4" y="-0.832443">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2159_1178" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2159_1178" mode="normal" result="shape" />
            </filter>
            <clipPath id="clip0_2159_1178">
              <rect fill="white" height="19.9786" transform="translate(0 2.16756)" width="19.9786" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.023px] size-[39.98px] top-0" data-name="Container">
      <Icon1 />
    </div>
  );
}

function Icon3D1() {
  return (
    <div className="absolute h-[46.996px] left-0 top-0 w-[39.98px]" data-name="Icon3D">
      <Container7 />
      <Container8 />
      <Container9 />
      <Container10 />
    </div>
  );
}

function Button1() {
  return (
    <div className="h-[67.974px] opacity-60 relative shrink-0 w-[39.98px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text1 />
        <Icon3D1 />
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute h-[16.482px] left-0 top-[58.29px] w-[48.374px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[15px] left-[24px] not-italic text-[#2aa676] text-[10px] text-center top-[-1.27px]" dir="auto">
        قريب مني
      </p>
    </div>
  );
}

function Container11() {
  return <div className="absolute bg-[rgba(224,69,69,0.35)] blur-[5px] h-[5.494px] left-[4.4px] rounded-[49888100px] top-[46.2px] w-[35.188px]" data-name="Container" />;
}

function Container12() {
  return (
    <div className="absolute left-0 rounded-[10px] shadow-[0px_3px_0px_0px_#b33030,0px_5px_7px_0px_rgba(224,69,69,0.35)] size-[43.979px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 107, 107) 0%, rgb(224, 69, 69) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container13() {
  return <div className="absolute h-[15.384px] left-[3.3px] rounded-bl-[5px] rounded-br-[10px] rounded-tl-[10px] rounded-tr-[5px] top-[3.3px] w-[17.581px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 17.581 15.384\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(0 -1.5229 -1.7404 0 5.2744 4.6151)\'><stop stop-color=\'rgba(255,255,255,0.45)\' offset=\'0\'/><stop stop-color=\'rgba(191,191,191,0.3375)\' offset=\'0.175\'/><stop stop-color=\'rgba(128,128,128,0.225)\' offset=\'0.35\'/><stop stop-color=\'rgba(64,64,64,0.1125)\' offset=\'0.525\'/><stop stop-color=\'rgba(0,0,0,0)\' offset=\'0.7\'/></radialGradient></defs></svg>')" }} />;
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[21.976px]" data-name="Icon">
      <div className="absolute inset-[-9.48%_-5.7%_-18.58%_-5.7%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.4824 28.1449">
          <g clipPath="url(#clip0_2159_1172)" filter="url(#filter0_d_2159_1172)" id="Icon">
            <path d={svgPaths.p2b6b00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83137" />
            <path d={svgPaths.p2a617400} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83137" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="29.9765" id="filter0_d_2159_1172" width="29.9765" x="-2.74706" y="-0.915687">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2159_1172" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2159_1172" mode="normal" result="shape" />
            </filter>
            <clipPath id="clip0_2159_1172">
              <rect fill="white" height="21.9765" transform="translate(1.25294 2.08431)" width="21.9765" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.026px] size-[43.979px] top-0" data-name="Container">
      <Icon2 />
    </div>
  );
}

function Icon3D2() {
  return (
    <div className="absolute h-[51.696px] left-[2.2px] top-0 w-[43.979px]" data-name="Icon3D">
      <Container11 />
      <Container12 />
      <Container13 />
      <Container14 />
    </div>
  );
}

function Button2() {
  return (
    <div className="h-[74.771px] relative shrink-0 w-[48.374px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text2 />
        <Icon3D2 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex gap-[23.998px] h-[67.974px] items-center justify-center left-0 pl-[2.176px] top-0 w-[360.544px]" data-name="Container">
      <Button />
      <Button1 />
      <Button2 />
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[27.993px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="-translate-x-full absolute font-['Cairo:Bold',sans-serif] font-bold leading-[28px] left-[361.52px] not-italic text-[18px] text-right text-white top-[-1.46px]" dir="auto">
        ماذا تريد أن تفعل اليوم؟
      </p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[16.006px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-full absolute font-['Cairo:Regular',sans-serif] font-normal leading-[16px] left-[361.01px] not-italic text-[#6a7282] text-[12px] text-right top-[-1.46px] w-[113px] whitespace-pre-wrap" dir="auto">
        صباح الخير أحمد الفارس
      </p>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[1.998px] h-[45.997px] items-start left-0 top-[154.86px] w-[360.544px]" data-name="Container">
      <Heading />
      <Paragraph />
    </div>
  );
}

function Text3() {
  return (
    <div className="absolute h-[27.993px] left-[11.99px] top-[11.99px] w-[85.234px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:ExtraBold',sans-serif] font-extrabold leading-[28px] left-[42.61px] not-italic text-[18px] text-center text-white top-[-1.46px]">7</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute bg-[rgba(28,32,38,0.8)] border-[1.487px] border-[rgba(42,166,118,0.15)] border-solid h-[78.939px] left-0 rounded-[16.4px] top-0 w-[112.182px]" data-name="Container">
      <Text3 />
      <p className="-translate-x-1/2 absolute font-['Cairo:Regular',sans-serif] font-normal leading-[13.5px] left-[55.05px] not-italic text-[#99a1af] text-[9px] text-center top-[48.93px]" dir="auto">
        طلبات جديدة
      </p>
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute h-[27.993px] left-[11.99px] top-[11.99px] w-[85.234px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:ExtraBold',sans-serif] font-extrabold leading-[28px] left-[42.83px] not-italic text-[#2aa676] text-[18px] text-center top-[-1.46px]">24,500</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute bg-[rgba(28,32,38,0.8)] border-[1.487px] border-[rgba(42,166,118,0.15)] border-solid h-[78.939px] left-[124.17px] rounded-[16.4px] top-0 w-[112.182px]" data-name="Container">
      <Text4 />
      <p className="-translate-x-1/2 absolute font-['Cairo:Regular',sans-serif] font-normal leading-[13.5px] left-[54.95px] not-italic text-[#99a1af] text-[9px] text-center top-[48.93px]" dir="auto">
        أرباح الشهر
      </p>
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[22.39px] size-[11.987px] top-[7.99px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9872 11.9872">
        <g clipPath="url(#clip0_2159_1115)" id="Icon">
          <path d={svgPaths.p12b9fd00} fill="var(--fill-0, #D4AF37)" id="Vector" stroke="var(--stroke-0, #D4AF37)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.998931" />
        </g>
        <defs>
          <clipPath id="clip0_2159_1115">
            <rect fill="white" height="11.9872" width="11.9872" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text5() {
  return (
    <div className="absolute h-[27.993px] left-[11.99px] top-[11.99px] w-[85.258px]" data-name="Text">
      <Icon3 />
      <p className="-translate-x-1/2 absolute font-['Cairo:ExtraBold',sans-serif] font-extrabold leading-[28px] left-[50.88px] not-italic text-[#d4af37] text-[18px] text-center top-[-1.46px]">{` 4.8`}</p>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute bg-[rgba(28,32,38,0.8)] border-[1.487px] border-[rgba(42,166,118,0.15)] border-solid h-[78.939px] left-[248.34px] rounded-[16.4px] top-0 w-[112.205px]" data-name="Container">
      <Text5 />
      <p className="-translate-x-1/2 absolute font-['Cairo:Regular',sans-serif] font-normal leading-[13.5px] left-[54.85px] not-italic text-[#99a1af] text-[9px] text-center top-[48.93px]" dir="auto">
        التقييم
      </p>
    </div>
  );
}

function ProviderStats() {
  return (
    <div className="absolute h-[78.939px] left-0 top-[220.83px] w-[360.544px]" data-name="ProviderStats">
      <Container16 />
      <Container17 />
      <Container18 />
    </div>
  );
}

function Button3() {
  return (
    <div className="h-[14.984px] relative shrink-0 w-[41.676px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[15px] left-[21px] not-italic text-[#2aa676] text-[10px] text-center top-[-0.97px]" dir="auto">
          رؤية الكل
        </p>
      </div>
    </div>
  );
}

function Container21() {
  return <div className="absolute bg-[rgba(224,69,69,0.35)] blur-[4px] h-[3.996px] left-[3.18px] rounded-[49888100px] top-[33.99px] w-[25.624px]" data-name="Container" />;
}

function Container22() {
  return (
    <div className="absolute left-0 rounded-[8px] shadow-[0px_2px_0px_0px_#b33030,0px_4px_6px_0px_rgba(224,69,69,0.35)] size-[31.989px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 107, 107) 0%, rgb(224, 69, 69) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container23() {
  return <div className="absolute h-[11.197px] left-[3px] rounded-bl-[4px] rounded-br-[8px] rounded-tl-[8px] rounded-tr-[4px] top-[3px] w-[12.777px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 12.777 11.197\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(0 -1.1085 -1.2649 0 3.8331 3.3592)\'><stop stop-color=\'rgba(255,255,255,0.45)\' offset=\'0\'/><stop stop-color=\'rgba(191,191,191,0.3375)\' offset=\'0.175\'/><stop stop-color=\'rgba(128,128,128,0.225)\' offset=\'0.35\'/><stop stop-color=\'rgba(64,64,64,0.1125)\' offset=\'0.525\'/><stop stop-color=\'rgba(0,0,0,0)\' offset=\'0.7\'/></radialGradient></defs></svg>')" }} />;
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[15.983px]" data-name="Icon">
      <div className="absolute inset-[-15.65%_-13.57%_-28.16%_-13.57%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.3201 22.9838">
          <g clipPath="url(#clip0_2159_1093)" filter="url(#filter0_d_2159_1093)" id="Icon">
            <path d={svgPaths.p20fb3e80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66488" />
            <path d={svgPaths.p16a9e100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66488" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="23.9829" id="filter0_d_2159_1093" width="23.9829" x="-1.83137" y="-0.499465">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2159_1093" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2159_1093" mode="normal" result="shape" />
            </filter>
            <clipPath id="clip0_2159_1093">
              <rect fill="white" height="15.9829" transform="translate(2.16863 2.50053)" width="15.9829" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.023px] size-[31.989px] top-0" data-name="Container">
      <Icon4 />
    </div>
  );
}

function Icon3D3() {
  return (
    <div className="absolute h-[37.983px] left-[69.55px] top-0 w-[31.989px]" data-name="Icon3D">
      <Container21 />
      <Container22 />
      <Container23 />
      <Container24 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[37.983px] relative shrink-0 w-[101.542px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Cairo:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[14px] text-white top-[9.02px]" dir="auto">
          قريب مني
        </p>
        <Icon3D3 />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[37.983px] relative shrink-0 w-[360.544px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Button3 />
        <Heading1 />
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[16.006px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="-translate-x-full absolute font-['Cairo:Bold',sans-serif] font-bold leading-[16px] left-[48.28px] not-italic text-[12px] text-right text-white top-[-1.46px]" dir="auto">
        مقاولات
      </p>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[14.984px] relative shrink-0 w-[11.151px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-full absolute font-['Cairo:Bold',sans-serif] font-bold leading-[15px] left-[12px] not-italic text-[#2aa676] text-[10px] text-right top-[-0.97px] w-[12px] whitespace-pre-wrap">5+</p>
      </div>
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[14.984px] relative shrink-0 w-[28.435px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-full absolute font-['Cairo:Regular',sans-serif] font-normal leading-[15px] left-[29px] not-italic text-[#99a1af] text-[10px] text-right top-[-0.97px] w-[29px] whitespace-pre-wrap" dir="auto">
          0.8 كم
        </p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[14.984px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex gap-[7.991px] items-center justify-end relative size-full">
          <Text6 />
          <Text7 />
        </div>
      </div>
    </div>
  );
}

function NearbyContent1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.996px] h-[34.986px] items-start left-[107.74px] top-[87.95px] w-[47.577px]" data-name="NearbyContent">
      <Heading2 />
      <Container26 />
    </div>
  );
}

function Container27() {
  return <div className="absolute bg-[rgba(42,166,118,0.35)] blur-[6px] h-[5.994px] left-[5.18px] rounded-[49888100px] top-[53.99px] w-[41.63px]" data-name="Container" />;
}

function Container28() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#1d7a56,0px_6px_8px_0px_rgba(42,166,118,0.35)] size-[51.991px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(76, 208, 128) 0%, rgb(42, 166, 118) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container29() {
  return <div className="absolute h-[18.19px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.792px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 20.792 18.19\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(0 -1.8007 -2.0583 0 6.2375 5.4569)\'><stop stop-color=\'rgba(255,255,255,0.45)\' offset=\'0\'/><stop stop-color=\'rgba(191,191,191,0.3375)\' offset=\'0.175\'/><stop stop-color=\'rgba(128,128,128,0.225)\' offset=\'0.35\'/><stop stop-color=\'rgba(64,64,64,0.1125)\' offset=\'0.525\'/><stop stop-color=\'rgba(0,0,0,0)\' offset=\'0.7\'/></radialGradient></defs></svg>')" }} />;
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[25.995px]" data-name="Icon">
      <div className="absolute inset-[-7.39%_-11.24%_-15.07%_-11.22%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.8337 31.8342">
          <g filter="url(#filter0_d_2159_994)" id="Icon">
            <path d={svgPaths.p1aa8c700} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9954" id="filter0_d_2159_994" width="33.9954" x="-1.08264" y="-1.07914">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2159_994" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2159_994" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.023px] size-[51.991px] top-0" data-name="Container">
      <Icon5 />
    </div>
  );
}

function Icon3D4() {
  return (
    <div className="absolute h-[59.982px] left-[103.33px] top-[15.98px] w-[51.991px]" data-name="Icon3D">
      <Container27 />
      <Container28 />
      <Container29 />
      <Container30 />
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute bg-[rgba(28,32,38,0.8)] border-[1.487px] border-[rgba(42,166,118,0.1)] border-solid h-[141.895px] left-0 rounded-[16px] top-0 w-[174.279px]" data-name="Button">
      <NearbyContent1 />
      <Icon3D4 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[16.006px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="-translate-x-full absolute font-['Cairo:Bold',sans-serif] font-bold leading-[16px] left-[48.05px] not-italic text-[12px] text-right text-white top-[-1.46px]" dir="auto">
        مواد بناء
      </p>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[14.984px] relative shrink-0 w-[11.151px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-full absolute font-['Cairo:Bold',sans-serif] font-bold leading-[15px] left-[12px] not-italic text-[#2aa676] text-[10px] text-right top-[-0.97px] w-[12px] whitespace-pre-wrap">3+</p>
      </div>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[14.984px] relative shrink-0 w-[28.435px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-full absolute font-['Cairo:Regular',sans-serif] font-normal leading-[15px] left-[29px] not-italic text-[#99a1af] text-[10px] text-right top-[-0.97px] w-[29px] whitespace-pre-wrap" dir="auto">
          1.2 كم
        </p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex gap-[7.991px] h-[14.984px] items-center justify-end relative shrink-0 w-full" data-name="Container">
      <Text8 />
      <Text9 />
    </div>
  );
}

function NearbyContent2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.996px] h-[34.986px] items-start left-[107.74px] top-[87.95px] w-[47.577px]" data-name="NearbyContent">
      <Heading3 />
      <Container31 />
    </div>
  );
}

function Container32() {
  return <div className="absolute bg-[rgba(240,144,48,0.35)] blur-[6px] h-[5.994px] left-[5.18px] rounded-[49888100px] top-[53.99px] w-[41.63px]" data-name="Container" />;
}

function Container33() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#c47020,0px_6px_8px_0px_rgba(240,144,48,0.35)] size-[51.991px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 179, 71) 0%, rgb(240, 144, 48) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container34() {
  return <div className="absolute h-[18.19px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.792px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 20.792 18.19\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(0 -1.8007 -2.0583 0 6.2375 5.4569)\'><stop stop-color=\'rgba(255,255,255,0.5)\' offset=\'0\'/><stop stop-color=\'rgba(191,191,191,0.375)\' offset=\'0.175\'/><stop stop-color=\'rgba(128,128,128,0.25)\' offset=\'0.35\'/><stop stop-color=\'rgba(64,64,64,0.125)\' offset=\'0.525\'/><stop stop-color=\'rgba(0,0,0,0)\' offset=\'0.7\'/></radialGradient></defs></svg>')" }} />;
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[25.995px]" data-name="Icon">
      <div className="absolute inset-[-7.37%_-7.05%_-15.07%_-7.05%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29.6629 31.8291">
          <g filter="url(#filter0_d_2159_1011)" id="Icon">
            <path d={svgPaths.p4e15700} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d="M5.19471 8.45254H24.4682" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p304b8700} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9954" id="filter0_d_2159_1011" width="33.9954" x="-2.16629" y="-1.08314">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2159_1011" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2159_1011" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.023px] size-[51.991px] top-0" data-name="Container">
      <Icon6 />
    </div>
  );
}

function Icon3D5() {
  return (
    <div className="absolute h-[59.982px] left-[103.33px] top-[15.98px] w-[51.991px]" data-name="Icon3D">
      <Container32 />
      <Container33 />
      <Container34 />
      <Container35 />
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute bg-[rgba(28,32,38,0.8)] border-[1.487px] border-[rgba(42,166,118,0.1)] border-solid h-[141.895px] left-[186.27px] rounded-[16px] top-0 w-[174.279px]" data-name="Button">
      <NearbyContent2 />
      <Icon3D5 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[16.006px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="-translate-x-full absolute font-['Cairo:Bold',sans-serif] font-bold leading-[16px] left-[48.36px] not-italic text-[12px] text-right text-white top-[-1.46px]" dir="auto">
        كهرباء
      </p>
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[14.984px] relative shrink-0 w-[11.151px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-full absolute font-['Cairo:Bold',sans-serif] font-bold leading-[15px] left-[12px] not-italic text-[#2aa676] text-[10px] text-right top-[-0.97px] w-[12px] whitespace-pre-wrap">7+</p>
      </div>
    </div>
  );
}

function Text11() {
  return (
    <div className="h-[14.984px] relative shrink-0 w-[28.435px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-full absolute font-['Cairo:Regular',sans-serif] font-normal leading-[15px] left-[29px] not-italic text-[#99a1af] text-[10px] text-right top-[-0.97px] w-[29px] whitespace-pre-wrap" dir="auto">
          1.5 كم
        </p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="h-[14.984px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex gap-[7.991px] items-center justify-end relative size-full">
          <Text10 />
          <Text11 />
        </div>
      </div>
    </div>
  );
}

function NearbyContent3() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.996px] h-[34.986px] items-start left-[107.74px] top-[87.95px] w-[47.577px]" data-name="NearbyContent">
      <Heading4 />
      <Container36 />
    </div>
  );
}

function Container37() {
  return <div className="absolute bg-[rgba(59,122,232,0.35)] blur-[6px] h-[5.994px] left-[5.18px] rounded-[49888100px] top-[53.99px] w-[41.63px]" data-name="Container" />;
}

function Container38() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#2a5db8,0px_6px_8px_0px_rgba(59,122,232,0.35)] size-[51.991px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(91, 156, 246) 0%, rgb(59, 122, 232) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container39() {
  return <div className="absolute h-[18.19px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.792px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 20.792 18.19\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(0 -1.8007 -2.0583 0 6.2375 5.4569)\'><stop stop-color=\'rgba(255,255,255,0.45)\' offset=\'0\'/><stop stop-color=\'rgba(191,191,191,0.3375)\' offset=\'0.175\'/><stop stop-color=\'rgba(128,128,128,0.225)\' offset=\'0.35\'/><stop stop-color=\'rgba(64,64,64,0.1125)\' offset=\'0.525\'/><stop stop-color=\'rgba(0,0,0,0)\' offset=\'0.7\'/></radialGradient></defs></svg>')" }} />;
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[25.995px]" data-name="Icon">
      <div className="absolute inset-[-7.38%_-7.07%_-15.08%_-7.07%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29.6702 31.8348">
          <g filter="url(#filter0_d_2159_1054)" id="Icon">
            <path d={svgPaths.p15ced580} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9954" id="filter0_d_2159_1054" width="33.9954" x="-2.16259" y="-1.08032">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2159_1054" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2159_1054" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.023px] size-[51.991px] top-0" data-name="Container">
      <Icon7 />
    </div>
  );
}

function Icon3D6() {
  return (
    <div className="absolute h-[59.982px] left-[103.33px] top-[15.98px] w-[51.991px]" data-name="Icon3D">
      <Container37 />
      <Container38 />
      <Container39 />
      <Container40 />
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute bg-[rgba(28,32,38,0.8)] border-[1.487px] border-[rgba(42,166,118,0.1)] border-solid h-[141.895px] left-0 rounded-[16px] top-[153.88px] w-[174.279px]" data-name="Button">
      <NearbyContent3 />
      <Icon3D6 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="h-[16.006px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="-translate-x-full absolute font-['Cairo:Bold',sans-serif] font-bold leading-[16px] left-[53px] not-italic text-[12px] text-right text-white top-[-1.46px]" dir="auto">
        استشارات
      </p>
    </div>
  );
}

function Text12() {
  return (
    <div className="h-[14.984px] relative shrink-0 w-[11.151px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-full absolute font-['Cairo:Bold',sans-serif] font-bold leading-[15px] left-[12px] not-italic text-[#2aa676] text-[10px] text-right top-[-0.97px] w-[12px] whitespace-pre-wrap">2+</p>
      </div>
    </div>
  );
}

function Text13() {
  return (
    <div className="h-[14.984px] relative shrink-0 w-[28.435px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-full absolute font-['Cairo:Regular',sans-serif] font-normal leading-[15px] left-[29px] not-italic text-[#99a1af] text-[10px] text-right top-[-0.97px] w-[29px] whitespace-pre-wrap" dir="auto">
          2.1 كم
        </p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="h-[14.984px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex gap-[7.991px] items-center justify-end relative size-full">
          <Text12 />
          <Text13 />
        </div>
      </div>
    </div>
  );
}

function NearbyContent4() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.996px] h-[34.986px] items-start left-[102.59px] top-[87.95px] w-[52.734px]" data-name="NearbyContent">
      <Heading5 />
      <Container41 />
    </div>
  );
}

function Container42() {
  return <div className="absolute bg-[rgba(124,90,218,0.35)] blur-[6px] h-[5.994px] left-[5.18px] rounded-[49888100px] top-[53.99px] w-[41.63px]" data-name="Container" />;
}

function Container43() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#5a3db5,0px_6px_8px_0px_rgba(124,90,218,0.35)] size-[51.991px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(155, 122, 237) 0%, rgb(124, 90, 218) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container44() {
  return <div className="absolute h-[18.19px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.792px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 20.792 18.19\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(0 -1.8007 -2.0583 0 6.2375 5.4569)\'><stop stop-color=\'rgba(255,255,255,0.45)\' offset=\'0\'/><stop stop-color=\'rgba(191,191,191,0.3375)\' offset=\'0.175\'/><stop stop-color=\'rgba(128,128,128,0.225)\' offset=\'0.35\'/><stop stop-color=\'rgba(64,64,64,0.1125)\' offset=\'0.525\'/><stop stop-color=\'rgba(0,0,0,0)\' offset=\'0.7\'/></radialGradient></defs></svg>')" }} />;
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[25.995px]" data-name="Icon">
      <div className="absolute inset-[-7.38%_-2.89%_-15.08%_-2.89%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.4966 31.8328">
          <g filter="url(#filter0_d_2159_1152)" id="Icon">
            <path d={svgPaths.p1aee100} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9954" id="filter0_d_2159_1152" width="33.9954" x="-3.24943" y="-1.08266">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2159_1152" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2159_1152" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.023px] size-[51.991px] top-0" data-name="Container">
      <Icon8 />
    </div>
  );
}

function Icon3D7() {
  return (
    <div className="absolute h-[59.982px] left-[103.33px] top-[15.98px] w-[51.991px]" data-name="Icon3D">
      <Container42 />
      <Container43 />
      <Container44 />
      <Container45 />
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute bg-[rgba(28,32,38,0.8)] border-[1.487px] border-[rgba(42,166,118,0.1)] border-solid h-[141.895px] left-[186.27px] rounded-[16px] top-[153.88px] w-[174.279px]" data-name="Button">
      <NearbyContent4 />
      <Icon3D7 />
    </div>
  );
}

function Container25() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[360.544px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Button4 />
        <Button5 />
        <Button6 />
        <Button7 />
      </div>
    </div>
  );
}

function NearbyContent() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[360.544px]" data-name="NearbyContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[11.987px] items-start relative size-full">
        <Container20 />
        <Container25 />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute content-stretch flex flex-col h-[345.746px] items-start left-0 top-[319.75px] w-[360.544px]" data-name="Container">
      <NearbyContent />
    </div>
  );
}

function Button8() {
  return (
    <div className="h-[14.984px] relative shrink-0 w-[41.676px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[15px] left-[21px] not-italic text-[#2aa676] text-[10px] text-center top-[-0.97px]" dir="auto">
          رؤية الكل
        </p>
      </div>
    </div>
  );
}

function Heading6() {
  return (
    <div className="h-[20.002px] relative shrink-0 w-[50.945px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Cairo:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[14px] text-white top-[0.03px]" dir="auto">
          الخدمات
        </p>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="h-[20.002px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between relative size-full">
          <Button8 />
          <Heading6 />
        </div>
      </div>
    </div>
  );
}

function ServiceSectionsGrid1() {
  return <div className="absolute left-0 size-[110.533px] top-0" data-name="ServiceSectionsGrid" style={{ backgroundImage: "linear-gradient(135deg, rgba(255, 105, 0, 0.06) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function ServiceSectionsGrid2() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.999px] left-[7.99px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.1)] w-[94.55px]" data-name="ServiceSectionsGrid" />;
}

function Container48() {
  return <div className="absolute bg-[rgba(240,144,48,0.35)] blur-[6px] h-[5.994px] left-[5.18px] rounded-[49888100px] top-[53.99px] w-[41.63px]" data-name="Container" />;
}

function Container49() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#c47020,0px_6px_8px_0px_rgba(240,144,48,0.35)] size-[51.991px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 179, 71) 0%, rgb(240, 144, 48) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container50() {
  return <div className="absolute h-[18.19px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.792px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 20.792 18.19\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(0 -1.8007 -2.0583 0 6.2375 5.4569)\'><stop stop-color=\'rgba(255,255,255,0.5)\' offset=\'0\'/><stop stop-color=\'rgba(191,191,191,0.375)\' offset=\'0.175\'/><stop stop-color=\'rgba(128,128,128,0.25)\' offset=\'0.35\'/><stop stop-color=\'rgba(64,64,64,0.125)\' offset=\'0.525\'/><stop stop-color=\'rgba(0,0,0,0)\' offset=\'0.7\'/></radialGradient></defs></svg>')" }} />;
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[25.995px]" data-name="Icon">
      <div className="absolute inset-[-3.21%_-11.22%_-10.9%_-11.22%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.8291 29.6629">
          <g filter="url(#filter0_d_2159_970)" id="Icon">
            <path d="M13.7483 13.8314H18.0809" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d="M13.7483 9.49886H18.0809" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p37c5ef00} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p191fbf40} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p38346080} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9954" id="filter0_d_2159_970" width="33.9954" x="-1.08314" y="-2.16629">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2159_970" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2159_970" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.023px] size-[51.991px] top-0" data-name="Container">
      <Icon9 />
    </div>
  );
}

function Icon3D8() {
  return (
    <div className="absolute h-[59.982px] left-[29.27px] top-[13.59px] w-[51.991px]" data-name="Icon3D">
      <Container48 />
      <Container49 />
      <Container50 />
      <Container51 />
    </div>
  );
}

function ServiceSectionsGrid3() {
  return (
    <div className="absolute h-[11.221px] left-[23.25px] overflow-clip top-[85.72px] w-[64.001px]" data-name="ServiceSectionsGrid">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[11.25px] left-[32.5px] not-italic text-[9px] text-[rgba(255,255,255,0.8)] text-center top-[0.03px]" dir="auto">
        مقاولات البناء
      </p>
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.487px] border-[rgba(255,105,0,0.15)] border-solid left-0 overflow-clip rounded-[22px] size-[113.506px] top-0" data-name="Button">
      <ServiceSectionsGrid1 />
      <ServiceSectionsGrid2 />
      <Icon3D8 />
      <ServiceSectionsGrid3 />
    </div>
  );
}

function ServiceSectionsGrid4() {
  return <div className="absolute left-0 size-[110.556px] top-0" data-name="ServiceSectionsGrid" style={{ backgroundImage: "linear-gradient(135deg, rgba(43, 127, 255, 0.06) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function ServiceSectionsGrid5() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.999px] left-[7.99px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.1)] w-[94.573px]" data-name="ServiceSectionsGrid" />;
}

function Container52() {
  return <div className="absolute bg-[rgba(59,122,232,0.35)] blur-[6px] h-[5.994px] left-[5.18px] rounded-[49888100px] top-[53.99px] w-[41.63px]" data-name="Container" />;
}

function Container53() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#2a5db8,0px_6px_8px_0px_rgba(59,122,232,0.35)] size-[51.991px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(91, 156, 246) 0%, rgb(59, 122, 232) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container54() {
  return <div className="absolute h-[18.19px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.792px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 20.792 18.19\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(0 -1.8007 -2.0583 0 6.2375 5.4569)\'><stop stop-color=\'rgba(255,255,255,0.45)\' offset=\'0\'/><stop stop-color=\'rgba(191,191,191,0.3375)\' offset=\'0.175\'/><stop stop-color=\'rgba(128,128,128,0.225)\' offset=\'0.35\'/><stop stop-color=\'rgba(64,64,64,0.1125)\' offset=\'0.525\'/><stop stop-color=\'rgba(0,0,0,0)\' offset=\'0.7\'/></radialGradient></defs></svg>')" }} />;
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[25.995px]" data-name="Icon">
      <div className="absolute inset-[-7.37%_-11.22%_-15.07%_-11.22%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.8291 31.8291">
          <g filter="url(#filter0_d_2159_964)" id="Icon">
            <path d={svgPaths.p298cd00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p3f18ed00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9954" id="filter0_d_2159_964" width="33.9954" x="-1.08314" y="-1.08314">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2159_964" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2159_964" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.023px] size-[51.991px] top-0" data-name="Container">
      <Icon10 />
    </div>
  );
}

function Icon3D9() {
  return (
    <div className="absolute h-[59.982px] left-[29.27px] top-[13.59px] w-[51.991px]" data-name="Icon3D">
      <Container52 />
      <Container53 />
      <Container54 />
      <Container55 />
    </div>
  );
}

function ServiceSectionsGrid6() {
  return (
    <div className="absolute h-[11.221px] left-[8.73px] overflow-clip top-[85.72px] w-[93.086px]" data-name="ServiceSectionsGrid">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[11.25px] left-[47px] not-italic text-[9px] text-[rgba(255,255,255,0.8)] text-center top-[0.03px]" dir="auto">
        الاستشارات الهندسية
      </p>
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.487px] border-[rgba(43,127,255,0.15)] border-solid left-[123.5px] overflow-clip rounded-[22px] size-[113.53px] top-0" data-name="Button">
      <ServiceSectionsGrid4 />
      <ServiceSectionsGrid5 />
      <Icon3D9 />
      <ServiceSectionsGrid6 />
    </div>
  );
}

function ServiceSectionsGrid7() {
  return <div className="absolute left-0 size-[110.533px] top-0" data-name="ServiceSectionsGrid" style={{ backgroundImage: "linear-gradient(135deg, rgba(0, 188, 125, 0.06) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function ServiceSectionsGrid8() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.999px] left-[7.99px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.1)] w-[94.55px]" data-name="ServiceSectionsGrid" />;
}

function Container56() {
  return <div className="absolute bg-[rgba(42,166,118,0.35)] blur-[6px] h-[5.994px] left-[5.18px] rounded-[49888100px] top-[53.99px] w-[41.63px]" data-name="Container" />;
}

function Container57() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#1d7a56,0px_6px_8px_0px_rgba(42,166,118,0.35)] size-[51.991px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(76, 208, 128) 0%, rgb(42, 166, 118) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container58() {
  return <div className="absolute h-[18.19px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.792px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 20.792 18.19\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(0 -1.8007 -2.0583 0 6.2375 5.4569)\'><stop stop-color=\'rgba(255,255,255,0.45)\' offset=\'0\'/><stop stop-color=\'rgba(191,191,191,0.3375)\' offset=\'0.175\'/><stop stop-color=\'rgba(128,128,128,0.225)\' offset=\'0.35\'/><stop stop-color=\'rgba(64,64,64,0.1125)\' offset=\'0.525\'/><stop stop-color=\'rgba(0,0,0,0)\' offset=\'0.7\'/></radialGradient></defs></svg>')" }} />;
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[25.995px]" data-name="Icon">
      <div className="absolute inset-[-7.39%_-11.24%_-15.07%_-11.22%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.8337 31.8342">
          <g filter="url(#filter0_d_2159_994)" id="Icon">
            <path d={svgPaths.p1aa8c700} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9954" id="filter0_d_2159_994" width="33.9954" x="-1.08264" y="-1.07914">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2159_994" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2159_994" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.023px] size-[51.991px] top-0" data-name="Container">
      <Icon11 />
    </div>
  );
}

function Icon3D10() {
  return (
    <div className="absolute h-[59.982px] left-[29.27px] top-[13.59px] w-[51.991px]" data-name="Icon3D">
      <Container56 />
      <Container57 />
      <Container58 />
      <Container59 />
    </div>
  );
}

function ServiceSectionsGrid9() {
  return (
    <div className="absolute h-[11.221px] left-[21.98px] overflow-clip top-[85.72px] w-[66.557px]" data-name="ServiceSectionsGrid">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[11.25px] left-[33.5px] not-italic text-[9px] text-[rgba(255,255,255,0.8)] text-center top-[0.03px]" dir="auto">
        شركات الصيانة
      </p>
    </div>
  );
}

function Button11() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.487px] border-[rgba(0,188,125,0.15)] border-solid left-[247.01px] overflow-clip rounded-[22px] size-[113.506px] top-0" data-name="Button">
      <ServiceSectionsGrid7 />
      <ServiceSectionsGrid8 />
      <Icon3D10 />
      <ServiceSectionsGrid9 />
    </div>
  );
}

function ServiceSectionsGrid10() {
  return <div className="absolute left-0 size-[110.533px] top-0" data-name="ServiceSectionsGrid" style={{ backgroundImage: "linear-gradient(135deg, rgba(254, 154, 0, 0.06) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function ServiceSectionsGrid11() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.999px] left-[7.99px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.1)] w-[94.55px]" data-name="ServiceSectionsGrid" />;
}

function Container60() {
  return <div className="absolute bg-[rgba(240,180,32,0.35)] blur-[6px] h-[5.994px] left-[5.18px] rounded-[49888100px] top-[53.99px] w-[41.63px]" data-name="Container" />;
}

function Container61() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#c49018,0px_6px_8px_0px_rgba(240,180,32,0.35)] size-[51.991px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 213, 79) 0%, rgb(240, 180, 32) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container62() {
  return <div className="absolute h-[18.19px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.792px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 20.792 18.19\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(0 -1.8007 -2.0583 0 6.2375 5.4569)\'><stop stop-color=\'rgba(255,255,255,0.5)\' offset=\'0\'/><stop stop-color=\'rgba(191,191,191,0.375)\' offset=\'0.175\'/><stop stop-color=\'rgba(128,128,128,0.25)\' offset=\'0.35\'/><stop stop-color=\'rgba(64,64,64,0.125)\' offset=\'0.525\'/><stop stop-color=\'rgba(0,0,0,0)\' offset=\'0.7\'/></radialGradient></defs></svg>')" }} />;
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[25.995px]" data-name="Icon">
      <div className="absolute inset-[0_-11.22%_-2.57%_-11.22%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.8291 26.6629">
          <g filter="url(#filter0_d_2159_1132)" id="Icon">
            <path d={svgPaths.p34d62000} id="Vector" stroke="var(--stroke-0, #5D4037)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p47f2f00} id="Vector_2" stroke="var(--stroke-0, #5D4037)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p64f6f20} id="Vector_3" stroke="var(--stroke-0, #5D4037)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.pd193380} id="Vector_4" stroke="var(--stroke-0, #5D4037)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9954" id="filter0_d_2159_1132" width="33.9954" x="-1.08314" y="-3">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2159_1132" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2159_1132" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.023px] size-[51.991px] top-0" data-name="Container">
      <Icon12 />
    </div>
  );
}

function Icon3D11() {
  return (
    <div className="absolute h-[59.982px] left-[29.27px] top-[13.59px] w-[51.991px]" data-name="Icon3D">
      <Container60 />
      <Container61 />
      <Container62 />
      <Container63 />
    </div>
  );
}

function ServiceSectionsGrid12() {
  return (
    <div className="absolute h-[11.221px] left-[20.81px] overflow-clip top-[85.72px] w-[68.88px]" data-name="ServiceSectionsGrid">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[11.25px] left-[34.5px] not-italic text-[9px] text-[rgba(255,255,255,0.8)] text-center top-[0.03px]" dir="auto">
        العمالة الحرفية
      </p>
    </div>
  );
}

function Button12() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.487px] border-[rgba(254,154,0,0.15)] border-solid left-0 overflow-clip rounded-[22px] size-[113.506px] top-[123.52px]" data-name="Button">
      <ServiceSectionsGrid10 />
      <ServiceSectionsGrid11 />
      <Icon3D11 />
      <ServiceSectionsGrid12 />
    </div>
  );
}

function ServiceSectionsGrid13() {
  return <div className="absolute left-0 size-[110.556px] top-0" data-name="ServiceSectionsGrid" style={{ backgroundImage: "linear-gradient(135deg, rgba(251, 44, 54, 0.06) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function ServiceSectionsGrid14() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.999px] left-[7.99px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.1)] w-[94.573px]" data-name="ServiceSectionsGrid" />;
}

function Container64() {
  return <div className="absolute bg-[rgba(224,69,69,0.35)] blur-[6px] h-[5.994px] left-[5.18px] rounded-[49888100px] top-[53.99px] w-[41.63px]" data-name="Container" />;
}

function Container65() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#b33030,0px_6px_8px_0px_rgba(224,69,69,0.35)] size-[51.991px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 107, 107) 0%, rgb(224, 69, 69) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container66() {
  return <div className="absolute h-[18.19px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.792px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 20.792 18.19\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(0 -1.8007 -2.0583 0 6.2375 5.4569)\'><stop stop-color=\'rgba(255,255,255,0.45)\' offset=\'0\'/><stop stop-color=\'rgba(191,191,191,0.3375)\' offset=\'0.175\'/><stop stop-color=\'rgba(128,128,128,0.225)\' offset=\'0.35\'/><stop stop-color=\'rgba(64,64,64,0.1125)\' offset=\'0.525\'/><stop stop-color=\'rgba(0,0,0,0)\' offset=\'0.7\'/></radialGradient></defs></svg>')" }} />;
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[25.995px]" data-name="Icon">
      <div className="absolute inset-[-3.21%_-11.22%_-15.05%_-11.2%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.8239 30.7402">
          <g filter="url(#filter0_d_2159_1161)" id="Icon">
            <path d={svgPaths.p21418300} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p1f0efb80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p5c5ab00} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9954" id="filter0_d_2159_1161" width="33.9954" x="-1.08837" y="-2.16629">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2159_1161" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2159_1161" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container67() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.023px] size-[51.991px] top-0" data-name="Container">
      <Icon13 />
    </div>
  );
}

function Icon3D12() {
  return (
    <div className="absolute h-[59.982px] left-[29.27px] top-[13.59px] w-[51.991px]" data-name="Icon3D">
      <Container64 />
      <Container65 />
      <Container66 />
      <Container67 />
    </div>
  );
}

function ServiceSectionsGrid15() {
  return (
    <div className="absolute h-[11.221px] left-[38.42px] overflow-clip top-[85.72px] w-[33.685px]" data-name="ServiceSectionsGrid">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[11.25px] left-[17px] not-italic text-[9px] text-[rgba(255,255,255,0.8)] text-center top-[0.03px]" dir="auto">
        الورش
      </p>
    </div>
  );
}

function Button13() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.487px] border-[rgba(251,44,54,0.15)] border-solid left-[123.5px] overflow-clip rounded-[22px] size-[113.53px] top-[123.52px]" data-name="Button">
      <ServiceSectionsGrid13 />
      <ServiceSectionsGrid14 />
      <Icon3D12 />
      <ServiceSectionsGrid15 />
    </div>
  );
}

function ServiceSectionsGrid16() {
  return <div className="absolute left-0 size-[110.533px] top-0" data-name="ServiceSectionsGrid" style={{ backgroundImage: "linear-gradient(135deg, rgba(212, 175, 55, 0.06) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function ServiceSectionsGrid17() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.999px] left-[7.99px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.1)] w-[94.55px]" data-name="ServiceSectionsGrid" />;
}

function Container68() {
  return <div className="absolute bg-[rgba(212,175,55,0.35)] blur-[6px] h-[5.994px] left-[5.18px] rounded-[49888100px] top-[53.99px] w-[41.63px]" data-name="Container" />;
}

function Container69() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#a88a20,0px_6px_8px_0px_rgba(212,175,55,0.35)] size-[51.991px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 215, 0) 0%, rgb(212, 175, 55) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container70() {
  return <div className="absolute h-[18.19px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.792px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 20.792 18.19\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(0 -1.8007 -2.0583 0 6.2375 5.4569)\'><stop stop-color=\'rgba(255,255,255,0.55)\' offset=\'0\'/><stop stop-color=\'rgba(191,191,191,0.4125)\' offset=\'0.175\'/><stop stop-color=\'rgba(128,128,128,0.275)\' offset=\'0.35\'/><stop stop-color=\'rgba(64,64,64,0.1375)\' offset=\'0.525\'/><stop stop-color=\'rgba(0,0,0,0)\' offset=\'0.7\'/></radialGradient></defs></svg>')" }} />;
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[25.995px]" data-name="Icon">
      <div className="absolute inset-[0_-11.22%_-6.73%_-11.22%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.8291 27.746">
          <g filter="url(#filter0_d_2159_1145)" id="Icon">
            <path d={svgPaths.p2fa2e900} id="Vector" stroke="var(--stroke-0, #5D4037)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d="M19.164 19.4966H12.6651" id="Vector_2" stroke="var(--stroke-0, #5D4037)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p2a772760} id="Vector_3" stroke="var(--stroke-0, #5D4037)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p30887df0} id="Vector_4" stroke="var(--stroke-0, #5D4037)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p33c1d600} id="Vector_5" stroke="var(--stroke-0, #5D4037)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9954" id="filter0_d_2159_1145" width="33.9954" x="-1.08314" y="-3">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2159_1145" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2159_1145" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container71() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.023px] size-[51.991px] top-0" data-name="Container">
      <Icon14 />
    </div>
  );
}

function Icon3D13() {
  return (
    <div className="absolute h-[59.982px] left-[29.27px] top-[13.59px] w-[51.991px]" data-name="Icon3D">
      <Container68 />
      <Container69 />
      <Container70 />
      <Container71 />
    </div>
  );
}

function ServiceSectionsGrid18() {
  return (
    <div className="absolute h-[11.221px] left-[24.62px] overflow-clip top-[85.72px] w-[61.26px]" data-name="ServiceSectionsGrid">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[11.25px] left-[31px] not-italic text-[9px] text-[rgba(255,255,255,0.8)] text-center top-[0.03px]" dir="auto">
        تأجير المعدات
      </p>
    </div>
  );
}

function Button14() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.487px] border-[rgba(212,175,55,0.15)] border-solid left-[247.01px] overflow-clip rounded-[22px] size-[113.506px] top-[123.52px]" data-name="Button">
      <ServiceSectionsGrid16 />
      <ServiceSectionsGrid17 />
      <Icon3D13 />
      <ServiceSectionsGrid18 />
    </div>
  );
}

function ServiceSectionsGrid19() {
  return <div className="absolute left-0 size-[110.533px] top-0" data-name="ServiceSectionsGrid" style={{ backgroundImage: "linear-gradient(135deg, rgba(187, 77, 0, 0.06) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function ServiceSectionsGrid20() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.999px] left-[7.99px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.1)] w-[94.55px]" data-name="ServiceSectionsGrid" />;
}

function Container72() {
  return <div className="absolute bg-[rgba(141,110,99,0.35)] blur-[6px] h-[5.994px] left-[5.18px] rounded-[49888100px] top-[53.99px] w-[41.63px]" data-name="Container" />;
}

function Container73() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#6d4c41,0px_6px_8px_0px_rgba(141,110,99,0.35)] size-[51.991px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(161, 136, 127) 0%, rgb(141, 110, 99) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container74() {
  return <div className="absolute h-[18.19px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.792px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 20.792 18.19\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(0 -1.8007 -2.0583 0 6.2375 5.4569)\'><stop stop-color=\'rgba(255,255,255,0.4)\' offset=\'0\'/><stop stop-color=\'rgba(191,191,191,0.3)\' offset=\'0.175\'/><stop stop-color=\'rgba(128,128,128,0.2)\' offset=\'0.35\'/><stop stop-color=\'rgba(64,64,64,0.1)\' offset=\'0.525\'/><stop stop-color=\'rgba(0,0,0,0)\' offset=\'0.7\'/></radialGradient></defs></svg>')" }} />;
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[25.995px]" data-name="Icon">
      <div className="absolute inset-[-7.37%_-7.05%_-15.07%_-7.05%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29.6629 31.8269">
          <g filter="url(#filter0_d_2159_1120)" id="Icon">
            <path d={svgPaths.pe5f9180} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d="M14.8314 25.7438V14.9124" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p1b740000} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p2f91afd0} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9954" id="filter0_d_2159_1120" width="33.9954" x="-2.16629" y="-1.08536">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2159_1120" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2159_1120" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container75() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.023px] size-[51.991px] top-0" data-name="Container">
      <Icon15 />
    </div>
  );
}

function Icon3D14() {
  return (
    <div className="absolute h-[59.982px] left-[29.27px] top-[13.59px] w-[51.991px]" data-name="Icon3D">
      <Container72 />
      <Container73 />
      <Container74 />
      <Container75 />
    </div>
  );
}

function ServiceSectionsGrid21() {
  return (
    <div className="absolute h-[11.221px] left-[17.05px] overflow-clip top-[85.72px] w-[76.407px]" data-name="ServiceSectionsGrid">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[11.25px] left-[38.5px] not-italic text-[9px] text-[rgba(255,255,255,0.8)] text-center top-[0.03px]" dir="auto">
        محلات مواد البناء
      </p>
    </div>
  );
}

function Button15() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.487px] border-[rgba(187,77,0,0.15)] border-solid left-0 overflow-clip rounded-[22px] size-[113.506px] top-[247.04px]" data-name="Button">
      <ServiceSectionsGrid19 />
      <ServiceSectionsGrid20 />
      <Icon3D14 />
      <ServiceSectionsGrid21 />
    </div>
  );
}

function ServiceSectionsGrid22() {
  return <div className="absolute left-0 size-[110.556px] top-0" data-name="ServiceSectionsGrid" style={{ backgroundImage: "linear-gradient(135deg, rgba(173, 70, 255, 0.06) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function ServiceSectionsGrid23() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.999px] left-[7.99px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.1)] w-[94.573px]" data-name="ServiceSectionsGrid" />;
}

function Container76() {
  return <div className="absolute bg-[rgba(124,90,218,0.35)] blur-[6px] h-[5.994px] left-[5.18px] rounded-[49888100px] top-[53.99px] w-[41.63px]" data-name="Container" />;
}

function Container77() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#5a3db5,0px_6px_8px_0px_rgba(124,90,218,0.35)] size-[51.991px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(155, 122, 237) 0%, rgb(124, 90, 218) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container78() {
  return <div className="absolute h-[18.19px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.792px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 20.792 18.19\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(0 -1.8007 -2.0583 0 6.2375 5.4569)\'><stop stop-color=\'rgba(255,255,255,0.45)\' offset=\'0\'/><stop stop-color=\'rgba(191,191,191,0.3375)\' offset=\'0.175\'/><stop stop-color=\'rgba(128,128,128,0.225)\' offset=\'0.35\'/><stop stop-color=\'rgba(64,64,64,0.1125)\' offset=\'0.525\'/><stop stop-color=\'rgba(0,0,0,0)\' offset=\'0.7\'/></radialGradient></defs></svg>')" }} />;
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[25.995px]" data-name="Icon">
      <div className="absolute inset-[0_-11.22%_-6.73%_-11.22%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.8291 27.746">
          <g filter="url(#filter0_d_2159_1138)" id="Icon">
            <path d={svgPaths.p2c710e80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p13dec00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d="M7.24943 19.4966V21.6629" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d="M24.5797 19.4966V21.6629" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d="M15.9146 4.33257V14.0809" id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9954" id="filter0_d_2159_1138" width="33.9954" x="-1.08314" y="-3">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2159_1138" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2159_1138" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container79() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.023px] size-[51.991px] top-0" data-name="Container">
      <Icon16 />
    </div>
  );
}

function Icon3D15() {
  return (
    <div className="absolute h-[59.982px] left-[29.27px] top-[13.59px] w-[51.991px]" data-name="Icon3D">
      <Container76 />
      <Container77 />
      <Container78 />
      <Container79 />
    </div>
  );
}

function ServiceSectionsGrid24() {
  return (
    <div className="absolute h-[11.221px] left-[8.13px] overflow-clip top-[85.72px] w-[94.294px]" data-name="ServiceSectionsGrid">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[11.25px] left-[47.5px] not-italic text-[9px] text-[rgba(255,255,255,0.8)] text-center top-[0.03px]" dir="auto">
        محلات الأثاث والديكور
      </p>
    </div>
  );
}

function Button16() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.487px] border-[rgba(173,70,255,0.15)] border-solid left-[123.5px] overflow-clip rounded-[22px] size-[113.53px] top-[247.04px]" data-name="Button">
      <ServiceSectionsGrid22 />
      <ServiceSectionsGrid23 />
      <Icon3D15 />
      <ServiceSectionsGrid24 />
    </div>
  );
}

function ServiceSectionsGrid25() {
  return <div className="absolute left-0 size-[110.533px] top-0" data-name="ServiceSectionsGrid" style={{ backgroundImage: "linear-gradient(135deg, rgba(0, 184, 219, 0.06) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function ServiceSectionsGrid26() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.999px] left-[7.99px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.1)] w-[94.55px]" data-name="ServiceSectionsGrid" />;
}

function Container80() {
  return <div className="absolute bg-[rgba(38,198,218,0.35)] blur-[6px] h-[5.994px] left-[5.18px] rounded-[49888100px] top-[53.99px] w-[41.63px]" data-name="Container" />;
}

function Container81() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#1a9aad,0px_6px_8px_0px_rgba(38,198,218,0.35)] size-[51.991px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(77, 208, 225) 0%, rgb(38, 198, 218) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container82() {
  return <div className="absolute h-[18.19px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.792px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 20.792 18.19\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(0 -1.8007 -2.0583 0 6.2375 5.4569)\'><stop stop-color=\'rgba(255,255,255,0.5)\' offset=\'0\'/><stop stop-color=\'rgba(191,191,191,0.375)\' offset=\'0.175\'/><stop stop-color=\'rgba(128,128,128,0.25)\' offset=\'0.35\'/><stop stop-color=\'rgba(64,64,64,0.125)\' offset=\'0.525\'/><stop stop-color=\'rgba(0,0,0,0)\' offset=\'0.7\'/></radialGradient></defs></svg>')" }} />;
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[25.995px]" data-name="Icon">
      <div className="absolute inset-[-7.38%_-11.23%_-15.08%_-11.23%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.8343 31.8343">
          <g filter="url(#filter0_d_2159_1126)" id="Icon">
            <path d={svgPaths.p19f22500} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d="M24.5823 4.08574V8.41831" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d="M26.7486 6.25202H22.416" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p30bd6b00} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9954" id="filter0_d_2159_1126" width="33.9954" x="-1.08055" y="-1.08055">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2159_1126" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2159_1126" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container83() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.023px] size-[51.991px] top-0" data-name="Container">
      <Icon17 />
    </div>
  );
}

function Icon3D16() {
  return (
    <div className="absolute h-[59.982px] left-[29.27px] top-[13.59px] w-[51.991px]" data-name="Icon3D">
      <Container80 />
      <Container81 />
      <Container82 />
      <Container83 />
    </div>
  );
}

function ServiceSectionsGrid27() {
  return (
    <div className="absolute h-[11.221px] left-[21.81px] overflow-clip top-[85.72px] w-[66.882px]" data-name="ServiceSectionsGrid">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[11.25px] left-[33.5px] not-italic text-[9px] text-[rgba(255,255,255,0.8)] text-center top-[0.03px]" dir="auto">
        خدمات النظافة
      </p>
    </div>
  );
}

function Button17() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.487px] border-[rgba(0,184,219,0.15)] border-solid left-[247.01px] overflow-clip rounded-[22px] size-[113.506px] top-[247.04px]" data-name="Button">
      <ServiceSectionsGrid25 />
      <ServiceSectionsGrid26 />
      <Icon3D16 />
      <ServiceSectionsGrid27 />
    </div>
  );
}

function Container47() {
  return (
    <div className="h-[360.568px] relative shrink-0 w-full" data-name="Container">
      <Button9 />
      <Button10 />
      <Button11 />
      <Button12 />
      <Button13 />
      <Button14 />
      <Button15 />
      <Button16 />
      <Button17 />
    </div>
  );
}

function ServiceSectionsGrid() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[11.987px] h-[392.557px] items-start left-0 top-[685.48px] w-[360.544px]" data-name="ServiceSectionsGrid">
      <Container46 />
      <Container47 />
    </div>
  );
}

function Heading7() {
  return (
    <div className="h-[20.002px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="-translate-x-full absolute font-['Cairo:Bold',sans-serif] font-bold leading-[20px] left-[213.94px] not-italic text-[14px] text-right text-white top-[0.03px]" dir="auto">
        مساعد وياك الذكي
      </p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[14.984px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-full absolute font-['Cairo:Regular',sans-serif] font-normal leading-[15px] left-[213.72px] not-italic text-[#99a1af] text-[10px] text-right top-[-0.97px]" dir="auto">
        تحب أساعدك في إيه؟
      </p>
    </div>
  );
}

function WeyaakQuickCard() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[1.998px] h-[36.984px] items-start left-[47.95px] top-[33.99px] w-[213.678px]" data-name="WeyaakQuickCard">
      <Heading7 />
      <Paragraph1 />
    </div>
  );
}

function Icon18() {
  return (
    <div className="absolute left-[15.98px] size-[15.983px] top-[44.49px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9829 15.9829">
        <g id="Icon">
          <path d={svgPaths.p27f9e880} id="Vector" stroke="var(--stroke-0, #2AA676)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33191" />
          <path d={svgPaths.p36fb4d52} id="Vector_2" stroke="var(--stroke-0, #2AA676)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33191" />
        </g>
      </svg>
    </div>
  );
}

function Container84() {
  return <div className="absolute bg-[rgba(67,160,71,0.35)] blur-[7px] h-[6.993px] left-[6.39px] rounded-[49888100px] top-[66px] w-[51.201px]" data-name="Container" />;
}

function Container85() {
  return (
    <div className="absolute left-0 rounded-[18px] shadow-[0px_5px_0px_0px_#2e7d32,0px_7px_9px_0px_rgba(67,160,71,0.35)] size-[63.978px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 187, 106) 0%, rgb(67, 160, 71) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container86() {
  return <div className="absolute h-[22.395px] left-[4px] rounded-bl-[9px] rounded-br-[18px] rounded-tl-[18px] rounded-tr-[9px] top-[4px] w-[25.577px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 25.577 22.395\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(0 -2.217 -2.532 0 7.6732 6.7184)\'><stop stop-color=\'rgba(255,255,255,0.45)\' offset=\'0\'/><stop stop-color=\'rgba(191,191,191,0.3375)\' offset=\'0.175\'/><stop stop-color=\'rgba(128,128,128,0.225)\' offset=\'0.35\'/><stop stop-color=\'rgba(64,64,64,0.1125)\' offset=\'0.525\'/><stop stop-color=\'rgba(0,0,0,0)\' offset=\'0.7\'/></radialGradient></defs></svg>')" }} />;
}

function Icon19() {
  return (
    <div className="relative shrink-0 size-[31.989px]" data-name="Icon">
      <div className="absolute inset-[0_-8.34%_-3.13%_-8.34%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 37.3233 32.9904">
          <g filter="url(#filter0_d_2159_997)" id="Icon">
            <path d={svgPaths.p17e08700} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66575" />
            <path d={svgPaths.p33bab780} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66575" />
            <path d="M5.33288 18.6603H7.99863" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66575" />
            <path d="M29.3246 18.6603H31.9904" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66575" />
            <path d="M22.6603 17.3274V19.9931" id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66575" />
            <path d="M14.663 17.3274V19.9931" id="Vector_6" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66575" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="39.989" id="filter0_d_2159_997" width="39.989" x="-1.33288" y="-3">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2159_997" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2159_997" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container87() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.023px] size-[63.978px] top-0" data-name="Container">
      <Icon19 />
    </div>
  );
}

function Icon3D17() {
  return (
    <div className="absolute h-[72.992px] left-[277.61px] top-[15.98px] w-[63.978px]" data-name="Icon3D">
      <Container84 />
      <Container85 />
      <Container86 />
      <Container87 />
    </div>
  );
}

function Button18() {
  return (
    <div className="absolute bg-gradient-to-l border-[1.487px] border-[rgba(42,166,118,0.2)] border-solid from-[rgba(42,166,118,0.2)] h-[107.931px] left-0 rounded-[16px] to-[rgba(28,32,38,0.8)] top-[1098.01px] w-[360.544px]" data-name="Button">
      <WeyaakQuickCard />
      <Icon18 />
      <Icon3D17 />
    </div>
  );
}

function Text14() {
  return (
    <div className="bg-[rgba(42,166,118,0.1)] h-[18.98px] relative rounded-[49888100px] shrink-0 w-[21.558px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Cairo:Bold',sans-serif] font-bold leading-[15px] left-[7.99px] not-italic text-[#2aa676] text-[10px] top-[1.02px]">5</p>
      </div>
    </div>
  );
}

function Heading8() {
  return (
    <div className="h-[20.002px] relative shrink-0 w-[82.028px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Cairo:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[14px] text-white top-[0.03px]" dir="auto">
          مشاريع جارية
        </p>
      </div>
    </div>
  );
}

function ActiveProjectCard() {
  return (
    <div className="content-stretch flex h-[20.002px] items-center justify-between relative shrink-0 w-full" data-name="ActiveProjectCard">
      <Text14 />
      <Heading8 />
    </div>
  );
}

function Text15() {
  return (
    <div className="h-[14.984px] relative shrink-0 w-[17.144px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Cairo:Bold',sans-serif] font-bold leading-[15px] left-0 not-italic text-[#2aa676] text-[10px] top-[-0.97px] w-[18px] whitespace-pre-wrap">45%</p>
      </div>
    </div>
  );
}

function Text16() {
  return (
    <div className="h-[16.006px] relative shrink-0 w-[131.255px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Cairo:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#d1d5dc] text-[12px] top-[-1.46px]" dir="auto">
          مشروع تشطيبات برج السلام
        </p>
      </div>
    </div>
  );
}

function Container89() {
  return (
    <div className="content-stretch flex h-[16.006px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text15 />
      <Text16 />
    </div>
  );
}

function Container91() {
  return <div className="bg-[#2aa676] h-[5.994px] rounded-[49888100px] shrink-0 w-[146.518px]" data-name="Container" />;
}

function Container90() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] content-stretch flex h-[5.994px] items-start justify-end overflow-clip relative rounded-[49888100px] shrink-0 w-full" data-name="Container">
      <Container91 />
    </div>
  );
}

function ActiveProjectCard1() {
  return (
    <div className="content-stretch flex flex-col gap-[7.991px] h-[29.991px] items-start relative shrink-0 w-full" data-name="ActiveProjectCard">
      <Container89 />
      <Container90 />
    </div>
  );
}

function Container88() {
  return (
    <div className="absolute bg-[rgba(28,32,38,0.8)] content-stretch flex flex-col gap-[11.987px] h-[96.92px] items-start left-0 pb-[1.487px] pt-[17.47px] px-[17.47px] rounded-[16px] top-[1225.92px] w-[360.544px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1.487px] border-[rgba(42,166,118,0.1)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <ActiveProjectCard />
      <ActiveProjectCard1 />
    </div>
  );
}

function TextInput() {
  return (
    <div className="absolute bg-[rgba(28,32,38,0.8)] h-[46.927px] left-0 rounded-[16px] top-0 w-[360.544px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip pl-[16px] pr-[48px] py-[12px] relative rounded-[inherit] size-full">
        <p className="font-['Cairo:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6a7282] text-[14px] text-right" dir="auto">
          ابحث عن خدمة، منتج، أو مزود...
        </p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.487px] border-[rgba(42,166,118,0.1)] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function Icon20() {
  return (
    <div className="absolute left-[326.58px] size-[17.981px] top-[13.99px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.9808 17.9808">
        <g id="Icon">
          <path d={svgPaths.p2c254200} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4984" />
          <path d={svgPaths.p236e780} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4984" />
        </g>
      </svg>
    </div>
  );
}

function Container92() {
  return (
    <div className="absolute h-[46.927px] left-0 top-[87.95px] w-[360.544px]" data-name="Container">
      <TextInput />
      <Icon20 />
    </div>
  );
}

function HomeView() {
  return (
    <div className="h-[1322.84px] relative shrink-0 w-full" data-name="HomeView">
      <Container2 />
      <Container15 />
      <ProviderStats />
      <Container19 />
      <ServiceSectionsGrid />
      <Button18 />
      <Container88 />
      <Container92 />
    </div>
  );
}

function MainContent() {
  return (
    <div className="absolute content-stretch flex flex-col h-[764.507px] items-start left-0 overflow-clip pt-[-60.679px] px-[15.983px] top-[87.42px] w-[392.51px]" data-name="Main Content">
      <HomeView />
    </div>
  );
}

function Container93() {
  return <div className="absolute bg-[rgba(10,13,15,0.85)] h-[87.418px] left-0 top-0 w-[392.51px]" data-name="Container" />;
}

function Container94() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.999px] left-0 to-[rgba(0,0,0,0)] top-[86.42px] via-1/2 via-[rgba(255,255,255,0.08)] w-[392.51px]" data-name="Container" />;
}

function Container95() {
  return <div className="absolute bg-[rgba(42,166,118,0.05)] blur-[64px] h-[79.984px] left-[232.52px] rounded-[49888100px] top-0 w-[159.992px]" data-name="Container" />;
}

function Button19() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] border-[1.487px] border-[rgba(255,255,255,0.08)] border-solid h-[33.94px] left-[47.97px] rounded-[49888100px] top-[3.02px] w-[58.542px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[15px] left-[27.99px] not-italic text-[#d1d5dc] text-[10px] text-center top-[7.02px]">English</p>
    </div>
  );
}

function Icon21() {
  return (
    <div className="absolute left-[9.5px] size-[17.981px] top-[9.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.9808 17.9808">
        <g clipPath="url(#clip0_2159_1166)" id="Icon">
          <path d={svgPaths.p26487f80} id="Vector" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4984" />
          <path d={svgPaths.p2d289300} id="Vector_2" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4984" />
        </g>
        <defs>
          <clipPath id="clip0_2159_1166">
            <rect fill="white" height="17.9808" width="17.9808" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text18() {
  return <div className="absolute bg-[rgba(251,44,54,0.3)] left-[-3.14px] opacity-84 rounded-[49888100px] size-[16.277px] top-[-3.14px]" data-name="Text" />;
}

function Text19() {
  return <div className="absolute bg-[#fb2c36] border-[#0a0d0f] border-[1.487px] border-solid left-0 rounded-[49888100px] shadow-[0px_10px_15px_0px_rgba(251,44,54,0.3),0px_4px_6px_0px_rgba(251,44,54,0.3)] size-[9.989px] top-0" data-name="Text" />;
}

function Text17() {
  return (
    <div className="absolute left-[21.02px] size-[9.989px] top-[5.99px]" data-name="Text">
      <Text18 />
      <Text19 />
    </div>
  );
}

function Button20() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] border-[1.487px] border-[rgba(255,255,255,0.08)] border-solid left-0 rounded-[49888100px] size-[39.98px] top-0" data-name="Button">
      <Icon21 />
      <Text17 />
    </div>
  );
}

function Container97() {
  return (
    <div className="h-[39.98px] relative shrink-0 w-[106.514px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Button19 />
        <Button20 />
      </div>
    </div>
  );
}

function Heading9() {
  return (
    <div className="h-[17.493px] relative shrink-0 w-[78.288px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Cairo:Bold',sans-serif] font-bold leading-[17.5px] left-0 not-italic text-[14px] text-white top-[-0.46px] tracking-[-0.35px]" dir="auto">
          أحمد الفارس
        </p>
      </div>
    </div>
  );
}

function Icon22() {
  return (
    <div className="absolute left-0 size-[9.989px] top-[6.97px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.98931 9.98931">
        <g id="Icon">
          <path d={svgPaths.p29176080} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.832442" />
        </g>
      </svg>
    </div>
  );
}

function Text21() {
  return <div className="absolute bg-gradient-to-r from-[rgba(43,127,255,0.1)] h-[20.978px] left-0 to-[rgba(0,0,0,0)] top-0 w-[40.979px]" data-name="Text" />;
}

function Text20() {
  return (
    <div className="absolute bg-[rgba(43,127,255,0.15)] border-[1.487px] border-[rgba(43,127,255,0.2)] border-solid h-[23.951px] left-[15.98px] overflow-clip rounded-[49888100px] top-0 w-[43.953px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[15px] left-[20.99px] not-italic text-[#51a2ff] text-[10px] text-center top-[2.02px]" dir="auto">
        مزود
      </p>
      <Text21 />
    </div>
  );
}

function Button21() {
  return (
    <div className="h-[23.951px] relative shrink-0 w-[59.936px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon22 />
        <Text20 />
      </div>
    </div>
  );
}

function Container99() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.996px] h-[45.44px] items-end left-0 top-0 w-[78.288px]" data-name="Container">
      <Heading9 />
      <Button21 />
    </div>
  );
}

function ImageUser() {
  return (
    <div className="h-[37.03px] relative shrink-0 w-full" data-name="Image (User)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageUser} />
    </div>
  );
}

function Container102() {
  return (
    <div className="h-[40.004px] relative rounded-[49888100px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-[1.487px] relative size-full">
          <ImageUser />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#0a0d0f] border-[1.487px] border-solid inset-0 pointer-events-none rounded-[49888100px]" />
    </div>
  );
}

function Container101() {
  return (
    <div className="absolute bg-gradient-to-b content-stretch flex flex-col from-[#d4af37] items-start left-0 pt-[1.998px] px-[1.998px] rounded-[49888100px] size-[43.999px] to-[#d4af37] top-0 via-1/2 via-[#2aa676]" data-name="Container">
      <Container102 />
    </div>
  );
}

function Icon23() {
  return (
    <div className="relative shrink-0 size-[9.989px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.98931 9.98931">
        <g id="Icon">
          <path d={svgPaths.p22ac6a98} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24866" />
        </g>
      </svg>
    </div>
  );
}

function Container103() {
  return (
    <div className="absolute bg-[#2aa676] content-stretch flex items-center justify-center left-[-2px] p-[1.487px] rounded-[49888100px] size-[19.979px] top-[26.02px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#0a0d0f] border-[1.487px] border-solid inset-0 pointer-events-none rounded-[49888100px] shadow-[0px_10px_15px_0px_rgba(42,166,118,0.3),0px_4px_6px_0px_rgba(42,166,118,0.3)]" />
      <Icon23 />
    </div>
  );
}

function Container104() {
  return <div className="absolute bg-[#00d492] border-[#0a0d0f] border-[1.487px] border-solid left-[32.01px] rounded-[49888100px] shadow-[0px_10px_15px_0px_rgba(0,212,146,0.4),0px_4px_6px_0px_rgba(0,212,146,0.4)] size-[11.987px] top-0" data-name="Container" />;
}

function Container100() {
  return (
    <div className="absolute left-[90.28px] size-[43.999px] top-[0.72px]" data-name="Container">
      <Container101 />
      <Container103 />
      <Container104 />
    </div>
  );
}

function Container98() {
  return (
    <div className="h-[45.44px] relative shrink-0 w-[134.275px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container99 />
        <Container100 />
      </div>
    </div>
  );
}

function Container96() {
  return (
    <div className="absolute content-stretch flex h-[87.418px] items-center justify-between left-0 px-[15.983px] top-0 w-[392.51px]" data-name="Container">
      <Container97 />
      <Container98 />
    </div>
  );
}

function Header() {
  return (
    <div className="absolute h-[87.418px] left-0 top-0 w-[392.51px]" data-name="Header">
      <Container93 />
      <Container94 />
      <Container95 />
      <Container96 />
    </div>
  );
}

function MobileLayout() {
  return (
    <div className="absolute bg-[#111318] h-[851.925px] left-0 overflow-clip shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] top-0 w-[392.51px]" data-name="MobileLayout">
      <Container />
      <Container1 />
      <MainContent />
      <Header />
    </div>
  );
}

function AppContent() {
  return (
    <div className="absolute bg-black h-[851.925px] left-0 top-0 w-[392.51px]" data-name="AppContent">
      <MobileLayout />
    </div>
  );
}

function Container105() {
  return <div className="absolute bg-[rgba(10,13,15,0.92)] border-[rgba(255,255,255,0.08)] border-solid border-t-[1.487px] h-[102.936px] left-0 rounded-tl-[28px] rounded-tr-[28px] top-0 w-[392.51px]" data-name="Container" />;
}

function Container106() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.999px] left-0 rounded-tl-[28px] rounded-tr-[28px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.1)] w-[392.51px]" data-name="Container" />;
}

function Container107() {
  return <div className="absolute bg-gradient-to-t from-[rgba(42,166,118,0.03)] h-[63.978px] left-0 rounded-tl-[28px] rounded-tr-[28px] to-[rgba(0,0,0,0)] top-[38.96px] w-[392.51px]" data-name="Container" />;
}

function Icon24() {
  return (
    <div className="h-[22px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[45.83%]" data-name="Vector">
        <div className="absolute inset-[-45%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.48329 3.48329">
            <path d={svgPaths.p2bbf8300} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.64998" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[45.83%] left-3/4 right-[16.67%] top-[45.83%]" data-name="Vector">
        <div className="absolute inset-[-45%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.48329 3.48329">
            <path d={svgPaths.p2bbf8300} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.64998" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[45.83%] left-[16.67%] right-3/4 top-[45.83%]" data-name="Vector">
        <div className="absolute inset-[-45%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.48329 3.48329">
            <path d={svgPaths.p2bbf8300} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.64998" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container109() {
  return (
    <div className="relative rounded-[16.4px] shrink-0 size-[37.983px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[7.991px] px-[7.991px] relative size-full">
        <Icon24 />
      </div>
    </div>
  );
}

function Text22() {
  return (
    <div className="h-[14.984px] relative shrink-0 w-[24.369px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Cairo:Medium',sans-serif] font-medium leading-[15px] left-[12.5px] not-italic text-[#4a5565] text-[10px] text-center top-[-0.97px]" dir="auto">
          المزيد
        </p>
      </div>
    </div>
  );
}

function Button22() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[1.998px] h-[70.947px] items-center justify-center left-[7.99px] top-[20px] w-[78.637px]" data-name="Button">
      <Container109 />
      <Text22 />
    </div>
  );
}

function Icon25() {
  return (
    <div className="h-[22px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[41.67%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-22.5%_-11.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.98321 5.3166">
            <path d={svgPaths.p1c2b8760} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.64998" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[25.14%_12.93%_74.86%_12.93%]" data-name="Vector">
        <div className="absolute inset-[-0.82px_-5.06%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.9609 1.64998">
            <path d="M0.824989 0.824989H17.1359" id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.64998" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-4.5%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.1498 19.9831">
            <path d={svgPaths.p1c045600} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.64998" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container110() {
  return (
    <div className="relative rounded-[16.4px] shrink-0 size-[37.983px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[7.991px] px-[7.991px] relative size-full">
        <Icon25 />
      </div>
    </div>
  );
}

function Text23() {
  return (
    <div className="h-[14.984px] relative shrink-0 w-[24.578px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Cairo:Medium',sans-serif] font-medium leading-[15px] left-[12.5px] not-italic text-[#4a5565] text-[10px] text-center top-[-0.97px]" dir="auto">
          المتجر
        </p>
      </div>
    </div>
  );
}

function Button23() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[1.998px] h-[70.947px] items-center justify-center left-[86.63px] top-[20px] w-[78.637px]" data-name="Button">
      <Container110 />
      <Text23 />
    </div>
  );
}

function Text24() {
  return (
    <div className="absolute h-[14.984px] left-[20.33px] top-[67.97px] w-[21.303px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[15px] left-[11px] not-italic text-[#6a7282] text-[10px] text-center top-[-0.97px]" dir="auto">
        وياك
      </p>
    </div>
  );
}

function Container111() {
  return <div className="absolute left-[-4.99px] rounded-[49888100px] size-[71.993px] top-[5.46px]" data-name="Container" />;
}

function Container113() {
  return <div className="absolute bg-gradient-to-b from-[rgba(255,255,255,0.2)] h-[19.979px] left-[11.99px] rounded-[49888100px] to-[rgba(0,0,0,0)] top-[4px] w-[35.032px]" data-name="Container" />;
}

function Container114() {
  return <div className="absolute border-[#0a0d0f] border-[2.974px] border-solid left-0 rounded-[49888100px] size-[59.007px] top-0" data-name="Container" />;
}

function Icon26() {
  return (
    <div className="absolute left-[16.49px] size-[25.995px] top-[16.49px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25.9954 25.9954">
        <g id="Icon">
          <path d={svgPaths.p32dee700} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
          <path d={svgPaths.pd25dd80} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
          <path d="M2.16629 15.164H4.33257" id="Vector_3" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
          <path d="M21.6629 15.164H23.8291" id="Vector_4" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
          <path d="M16.2471 14.0809V16.2471" id="Vector_5" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
          <path d="M9.74829 14.0809V16.2471" id="Vector_6" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
        </g>
      </svg>
    </div>
  );
}

function Container112() {
  return (
    <div className="absolute bg-[#1a1d21] border-[1.487px] border-[rgba(255,255,255,0.1)] border-solid left-0 rounded-[49888100px] size-[61.98px] top-0" data-name="Container">
      <Container113 />
      <Container114 />
      <Icon26 />
    </div>
  );
}

function Button24() {
  return (
    <div className="absolute h-[82.958px] left-[165.26px] top-[-20px] w-[61.98px]" data-name="Button">
      <Text24 />
      <Container111 />
      <Container112 />
    </div>
  );
}

function Icon27() {
  return (
    <div className="h-[22px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%_33.33%_16.67%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-5%_-11.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.98321 18.1498">
            <path d={svgPaths.p2277cf40} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.64998" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[16.67%] left-[8.33%] right-[8.33%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-6.43%_-4.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9831 14.4831">
            <path d={svgPaths.p39d48400} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.64998" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container115() {
  return (
    <div className="relative rounded-[16.4px] shrink-0 size-[37.983px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[7.991px] px-[7.991px] relative size-full">
        <Icon27 />
      </div>
    </div>
  );
}

function Text25() {
  return (
    <div className="h-[14.984px] relative shrink-0 w-[39.771px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Cairo:Medium',sans-serif] font-medium leading-[15px] left-[20px] not-italic text-[#4a5565] text-[10px] text-center top-[-0.97px]" dir="auto">
          مشاريعي
        </p>
      </div>
    </div>
  );
}

function Button25() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[1.998px] h-[70.947px] items-center justify-center left-[227.25px] top-[20px] w-[78.637px]" data-name="Button">
      <Container115 />
      <Text25 />
    </div>
  );
}

function Icon28() {
  return (
    <div className="h-[22px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[12.5%] left-[37.5%] right-[37.5%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-13.89%_-20.83%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.79156 10.5415">
            <path d={svgPaths.p1ca5f1c0} id="Vector" stroke="var(--stroke-0, #2AA676)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29164" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_12.5%_12.5%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-6.58%_-6.94%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.7914 19.7085">
            <path d={svgPaths.p3d62f80} id="Vector" stroke="var(--stroke-0, #2AA676)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29164" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container116() {
  return (
    <div className="absolute bg-[rgba(42,166,118,0.12)] content-stretch flex flex-col items-start left-[20.33px] pt-[7.991px] px-[7.991px] rounded-[16.4px] size-[37.983px] top-[7.99px]" data-name="Container">
      <Icon28 />
    </div>
  );
}

function Text26() {
  return (
    <div className="absolute h-[14.984px] left-[23.25px] top-[47.97px] w-[32.128px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:Medium',sans-serif] font-medium leading-[15px] left-[16.5px] not-italic text-[#2aa676] text-[10px] text-center top-[-0.97px]" dir="auto">
        الرئيسية
      </p>
    </div>
  );
}

function Container117() {
  return <div className="absolute bg-[#2aa676] h-[3.996px] left-[29.32px] rounded-[49888100px] shadow-[0px_10px_15px_0px_rgba(42,166,118,0.4),0px_4px_6px_0px_rgba(42,166,118,0.4)] top-[-2px] w-[19.979px]" data-name="Container" />;
}

function Button26() {
  return (
    <div className="absolute h-[70.947px] left-[305.88px] top-[20px] w-[78.637px]" data-name="Button">
      <Container116 />
      <Text26 />
      <Container117 />
    </div>
  );
}

function Container108() {
  return (
    <div className="absolute h-[102.936px] left-0 top-0 w-[392.51px]" data-name="Container">
      <Button22 />
      <Button23 />
      <Button24 />
      <Button25 />
      <Button26 />
    </div>
  );
}

function MobileLayout1() {
  return (
    <div className="absolute h-[102.936px] left-0 top-[748.99px] w-[392.51px]" data-name="MobileLayout">
      <Container105 />
      <Container106 />
      <Container107 />
      <Container108 />
    </div>
  );
}

function Icon29() {
  return (
    <div className="h-[19.979px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-1/2 left-[12.5%] right-[58.33%] top-[12.5%]" data-name="Vector">
        <div className="absolute inset-[-13.89%_-17.86%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.9082 9.57309">
            <path d={svgPaths.p22237680} id="Vector" stroke="var(--stroke-0, #2AA676)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.08111" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_12.5%_66.67%_58.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-17.86%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.9082 6.24332">
            <path d={svgPaths.pd7a0580} id="Vector" stroke="var(--stroke-0, #2AA676)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.08111" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[12.5%] left-[58.33%] right-[12.5%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-13.89%_-17.86%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.9082 9.57309">
            <path d={svgPaths.p22237680} id="Vector" stroke="var(--stroke-0, #2AA676)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.08111" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[66.67%_58.33%_12.5%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-25%_-17.86%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.9082 6.24332">
            <path d={svgPaths.pd7a0580} id="Vector" stroke="var(--stroke-0, #2AA676)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.08111" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container119() {
  return (
    <div className="bg-[rgba(42,166,118,0.15)] relative rounded-[16.4px] shrink-0 size-[31.966px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[5.994px] px-[5.994px] relative size-full">
        <Icon29 />
      </div>
    </div>
  );
}

function Text27() {
  return (
    <div className="h-[13.474px] relative shrink-0 w-[45.231px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Cairo:Medium',sans-serif] font-medium leading-[13.5px] left-[23px] not-italic text-[#2aa676] text-[9px] text-center top-[0.51px]" dir="auto">
          لوحة التحكم
        </p>
      </div>
    </div>
  );
}

function Button27() {
  return (
    <div className="flex-[1_0_0] h-[59.425px] min-h-px min-w-px relative" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[1.998px] items-center justify-center relative size-full">
        <Container119 />
        <Text27 />
      </div>
    </div>
  );
}

function Icon30() {
  return (
    <div className="h-[19.979px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-4.5%_-5.62%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.8175 18.1473">
            <path d={svgPaths.p21b88880} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4984" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_16.67%_66.67%_58.33%]" data-name="Vector">
        <div className="absolute inset-[-15%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.49305 6.49305">
            <path d={svgPaths.p2e50c300} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4984" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[68.66%_62.5%_8.33%_12.51%]" data-name="Vector">
        <div className="absolute inset-[-16.3%_-15%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.49172 6.09466">
            <path d={svgPaths.p7df1700} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4984" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[45.83%_62.5%_29.17%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-15%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.49305 6.49305">
            <path d={svgPaths.p1ee21a00} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4984" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container120() {
  return (
    <div className="relative rounded-[16.4px] shrink-0 size-[31.966px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[5.994px] px-[5.994px] relative size-full">
        <Icon30 />
      </div>
    </div>
  );
}

function Text28() {
  return (
    <div className="h-[13.474px] relative shrink-0 w-[35.799px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Cairo:Medium',sans-serif] font-medium leading-[13.5px] left-[18px] not-italic text-[#4a5565] text-[9px] text-center top-[0.51px]" dir="auto">
          مشاريعي
        </p>
      </div>
    </div>
  );
}

function Button28() {
  return (
    <div className="flex-[1_0_0] h-[59.425px] min-h-px min-w-px relative" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[1.998px] items-center justify-center relative size-full">
        <Container120 />
        <Text28 />
      </div>
    </div>
  );
}

function Icon31() {
  return (
    <div className="h-[19.979px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-4.5%_-5.62%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.8175 18.1472">
            <path d={svgPaths.p26e77f00} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4984" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_16.67%_66.67%_58.33%]" data-name="Vector">
        <div className="absolute inset-[-15%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.49305 6.49305">
            <path d={svgPaths.p2e50c300} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4984" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.5%_58.33%_62.5%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.75px_-45%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.16328 1.4984">
            <path d="M2.41408 0.749198H0.749198" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4984" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[54.17%_33.33%_45.83%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.75px_-11.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.15794 1.4984">
            <path d="M7.40874 0.749198H0.749198" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4984" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[70.83%_33.33%_29.17%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.75px_-11.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.15794 1.4984">
            <path d="M7.40874 0.749198H0.749198" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4984" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container121() {
  return (
    <div className="relative rounded-[16.4px] shrink-0 size-[31.966px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[5.994px] px-[5.994px] relative size-full">
        <Icon31 />
      </div>
    </div>
  );
}

function Text29() {
  return (
    <div className="h-[13.474px] relative shrink-0 w-[39.609px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Cairo:Medium',sans-serif] font-medium leading-[13.5px] left-[20px] not-italic text-[#4a5565] text-[9px] text-center top-[0.51px]" dir="auto">
          المناقصات
        </p>
      </div>
    </div>
  );
}

function Button29() {
  return (
    <div className="flex-[1_0_0] h-[59.425px] min-h-px min-w-px relative" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[1.998px] items-center justify-center relative size-full">
        <Container121 />
        <Text29 />
      </div>
    </div>
  );
}

function Icon32() {
  return (
    <div className="h-[19.979px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-3/4 left-[33.33%] right-[33.33%] top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-22.5%_-11.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.15794 4.82817">
            <path d={svgPaths.p3195e830} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4984" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[16.67%_16.67%_8.33%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-5%_-5.62%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.8175 16.4824">
            <path d={svgPaths.p4060d66} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4984" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[54.17%] left-1/2 right-[33.33%] top-[45.83%]" data-name="Vector">
        <div className="absolute inset-[-0.75px_-22.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.82817 1.4984">
            <path d="M0.749198 0.749198H4.07897" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4984" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[33.33%] left-1/2 right-[33.33%] top-[66.67%]" data-name="Vector">
        <div className="absolute inset-[-0.75px_-22.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.82817 1.4984">
            <path d="M0.749198 0.749198H4.07897" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4984" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[45.83%_66.62%_54.17%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.75px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.50672 1.4984">
            <path d="M0.749198 0.749198H0.757523" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4984" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[66.67%_66.62%_33.33%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.75px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.50672 1.4984">
            <path d="M0.749198 0.749198H0.757523" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4984" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container122() {
  return (
    <div className="relative rounded-[16.4px] shrink-0 size-[31.966px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[5.994px] px-[5.994px] relative size-full">
        <Icon32 />
      </div>
    </div>
  );
}

function Text30() {
  return (
    <div className="h-[13.474px] relative shrink-0 w-[27.203px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Cairo:Medium',sans-serif] font-medium leading-[13.5px] left-[14px] not-italic text-[#4a5565] text-[9px] text-center top-[0.51px]" dir="auto">
          الطلبات
        </p>
      </div>
    </div>
  );
}

function Button30() {
  return (
    <div className="flex-[1_0_0] h-[59.425px] min-h-px min-w-px relative" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[1.998px] items-center justify-center relative size-full">
        <Container122 />
        <Text30 />
      </div>
    </div>
  );
}

function Icon33() {
  return (
    <div className="h-[19.979px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[12.5%] left-1/2 right-1/2 top-[29.17%]" data-name="Vector">
        <div className="absolute inset-[-6.43%_-0.75px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.4984 13.1526">
            <path d="M0.749198 0.749198V12.4034" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4984" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%_-4.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.1472 16.4824">
            <path d={svgPaths.p24cba800} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4984" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container123() {
  return (
    <div className="relative rounded-[16.4px] shrink-0 size-[31.966px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[5.994px] px-[5.994px] relative size-full">
        <Icon33 />
      </div>
    </div>
  );
}

function Text31() {
  return (
    <div className="h-[13.474px] relative shrink-0 w-[31.548px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Cairo:Medium',sans-serif] font-medium leading-[13.5px] left-[16px] not-italic text-[#4a5565] text-[9px] text-center top-[0.51px]" dir="auto">
          اليوميات
        </p>
      </div>
    </div>
  );
}

function Button31() {
  return (
    <div className="flex-[1_0_0] h-[59.425px] min-h-px min-w-px relative" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[1.998px] items-center justify-center relative size-full">
        <Container123 />
        <Text31 />
      </div>
    </div>
  );
}

function Container118() {
  return (
    <div className="content-stretch flex h-[59.425px] items-end justify-between relative shrink-0 w-full" data-name="Container">
      <Button27 />
      <Button28 />
      <Button29 />
      <Button30 />
      <Button31 />
    </div>
  );
}

function ProjectsOverlay() {
  return (
    <div className="absolute bg-[rgba(10,13,15,0.95)] content-stretch flex flex-col h-[76.894px] items-start left-0 pt-[9.478px] px-[3.996px] top-[775.03px] w-[392.51px]" data-name="ProjectsOverlay">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-solid border-t-[1.487px] inset-0 pointer-events-none" />
      <Container118 />
    </div>
  );
}

function Container124() {
  return <div className="h-[851.925px] shrink-0 w-[392.51px]" data-name="Container" />;
}

function AppContent1() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0.5)] content-stretch flex h-[851.925px] items-start justify-center left-0 top-0 w-[392.51px]" data-name="AppContent">
      <Container124 />
    </div>
  );
}

function Container126() {
  return <div className="absolute h-[189.89px] left-[1.49px] top-[1.49px] w-[357.571px]" data-name="Container" style={{ backgroundImage: "linear-gradient(207.971deg, rgba(42, 166, 118, 0.08) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function Container127() {
  return <div className="absolute bg-[rgba(42,166,118,0.05)] blur-[64px] left-[231.08px] rounded-[49888100px] size-[127.979px] top-[1.49px]" data-name="Container" />;
}

function Icon34() {
  return (
    <div className="absolute left-[46.11px] size-[9.989px] top-[7.97px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.98931 9.98931">
        <g id="Icon">
          <path d={svgPaths.p360f28c0} id="Vector" stroke="var(--stroke-0, #2AA676)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.832442" />
          <path d={svgPaths.p3532fc00} id="Vector_2" stroke="var(--stroke-0, #2AA676)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.832442" />
        </g>
      </svg>
    </div>
  );
}

function Text32() {
  return (
    <div className="bg-[rgba(42,166,118,0.15)] h-[25.949px] relative rounded-[49888100px] shrink-0 w-[67.579px]" data-name="Text">
      <div aria-hidden="true" className="absolute border-[1.487px] border-[rgba(42,166,118,0.1)] border-solid inset-0 pointer-events-none rounded-[49888100px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon34 />
        <p className="absolute font-['Cairo:Bold',sans-serif] font-bold leading-[15px] left-[11.48px] not-italic text-[#2aa676] text-[10px] top-[4.51px]">+12.5%</p>
      </div>
    </div>
  );
}

function Text33() {
  return (
    <div className="h-[16.517px] relative shrink-0 w-[58.821px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Cairo:Regular',sans-serif] font-normal leading-[16.5px] left-0 not-italic text-[#6a7282] text-[11px] top-[0.03px]" dir="auto">
          إجمالي الأرباح
        </p>
      </div>
    </div>
  );
}

function Container129() {
  return (
    <div className="content-stretch flex h-[25.949px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text32 />
      <Text33 />
    </div>
  );
}

function Heading10() {
  return (
    <div className="h-[31.989px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="-translate-x-full absolute font-['Cairo:ExtraBold',sans-serif] font-extrabold leading-[32px] left-[318.55px] not-italic text-[32px] text-right text-white top-[-0.87px]">45,000</p>
    </div>
  );
}

function Text34() {
  return (
    <div className="h-[16.006px] relative shrink-0 w-full" data-name="Text">
      <p className="-translate-x-full absolute font-['Cairo:Regular',sans-serif] font-normal leading-[16px] left-[317.97px] not-italic text-[#6a7282] text-[12px] text-right top-[-1.46px]" dir="auto">
        د.إ
      </p>
    </div>
  );
}

function Container128() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.996px] h-[117.897px] items-start left-[1.49px] pt-[19.979px] px-[19.979px] top-[1.49px] w-[357.571px]" data-name="Container">
      <Container129 />
      <Heading10 />
      <Text34 />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents inset-[0_0.01%]" data-name="Group">
      <div className="absolute inset-[0_0.01%]" data-name="recharts-area-:rg:">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 357.929 79.9842">
          <path d={svgPaths.p220b7780} fill="url(#paint0_linear_2159_1113)" fillOpacity="0.6" id="recharts-area-:rg:" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_2159_1113" x1="0" x2="0" y1="0" y2="79.9842">
              <stop stopColor="#2AA676" stopOpacity="0.35" />
              <stop offset="1" stopColor="#2AA676" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute inset-[0_0.01%_22.5%_0.01%]" data-name="Vector">
        <div className="absolute inset-[-1.42%_-0.25%_-1.59%_-0.22%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 359.59 63.849">
            <path d={svgPaths.p3a87b180} id="Vector" stroke="var(--stroke-0, #2AA676)" strokeWidth="2.49951" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[0_0.01%]" data-name="Group">
      <Group2 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[0_0.01%]" data-name="Group">
      <Group1 />
    </div>
  );
}

function Icon35() {
  return (
    <div className="h-[79.984px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group />
    </div>
  );
}

function Container130() {
  return (
    <div className="absolute content-stretch flex flex-col h-[79.984px] items-start left-[1.49px] top-[111.39px] w-[357.989px]" data-name="Container">
      <Icon35 />
    </div>
  );
}

function Dashboard() {
  return (
    <div className="bg-[rgba(17,21,24,0.9)] h-[192.863px] relative rounded-[22px] shrink-0 w-full" data-name="Dashboard">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Container126 />
        <Container127 />
        <Container128 />
        <Container130 />
      </div>
      <div aria-hidden="true" className="absolute border-[1.487px] border-[rgba(42,166,118,0.15)] border-solid inset-0 pointer-events-none rounded-[22px]" />
    </div>
  );
}

function Container132() {
  return <div className="absolute h-[75.965px] left-0 top-0 w-[110.533px]" data-name="Container" style={{ backgroundImage: "linear-gradient(145.501deg, rgba(43, 127, 255, 0.08) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function Text35() {
  return (
    <div className="absolute h-[27.993px] left-[11.99px] top-[11.99px] w-[86.559px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:ExtraBold',sans-serif] font-extrabold leading-[28px] left-[43.67px] not-italic text-[20px] text-center text-white top-[-0.95px]">12</p>
    </div>
  );
}

function Container131() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.487px] border-[rgba(43,127,255,0.2)] border-solid h-[78.939px] left-0 overflow-clip rounded-[16px] top-0 w-[113.506px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Cairo:Regular',sans-serif] font-normal leading-[13.5px] left-[55.34px] not-italic text-[#6a7282] text-[9px] text-center top-[48.93px]" dir="auto">
        إجمالي المشاريع
      </p>
      <Container132 />
      <Text35 />
    </div>
  );
}

function Container134() {
  return <div className="absolute h-[75.965px] left-0 top-0 w-[110.556px]" data-name="Container" style={{ backgroundImage: "linear-gradient(145.506deg, rgba(0, 188, 125, 0.08) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function Text36() {
  return (
    <div className="absolute h-[27.993px] left-[11.99px] top-[11.99px] w-[86.582px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:ExtraBold',sans-serif] font-extrabold leading-[28px] left-[43.73px] not-italic text-[#2aa676] text-[20px] text-center top-[-0.95px]">8</p>
    </div>
  );
}

function Container133() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.487px] border-[rgba(0,188,125,0.2)] border-solid h-[78.939px] left-[123.5px] overflow-clip rounded-[16px] top-0 w-[113.53px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Cairo:Regular',sans-serif] font-normal leading-[13.5px] left-[55.73px] not-italic text-[#6a7282] text-[9px] text-center top-[48.93px]" dir="auto">
        المشاريع المكتملة
      </p>
      <Container134 />
      <Text36 />
    </div>
  );
}

function Container136() {
  return <div className="absolute h-[75.965px] left-0 top-0 w-[110.533px]" data-name="Container" style={{ backgroundImage: "linear-gradient(145.501deg, rgba(212, 175, 55, 0.08) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function Text37() {
  return (
    <div className="absolute h-[27.993px] left-[11.99px] top-[11.99px] w-[86.559px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:ExtraBold',sans-serif] font-extrabold leading-[28px] left-[43.73px] not-italic text-[#d4af37] text-[20px] text-center top-[-0.95px]">4</p>
    </div>
  );
}

function Container135() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.487px] border-[rgba(212,175,55,0.2)] border-solid h-[78.939px] left-[247.01px] overflow-clip rounded-[16px] top-0 w-[113.506px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Cairo:Regular',sans-serif] font-normal leading-[13.5px] left-[55.31px] not-italic text-[#6a7282] text-[9px] text-center top-[48.93px]" dir="auto">
        المشاريع المعلقة
      </p>
      <Container136 />
      <Text37 />
    </div>
  );
}

function Dashboard1() {
  return (
    <div className="h-[78.939px] relative shrink-0 w-full" data-name="Dashboard">
      <Container131 />
      <Container133 />
      <Container135 />
    </div>
  );
}

function Heading11() {
  return (
    <div className="h-[20.002px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="-translate-x-full absolute font-['Cairo:Bold',sans-serif] font-bold leading-[20px] left-[361.12px] not-italic text-[14px] text-right text-white top-[0.03px]" dir="auto">
        إدارة الأعمال
      </p>
    </div>
  );
}

function Dashboard3() {
  return <div className="absolute left-0 opacity-80 size-[110.533px] top-0" data-name="Dashboard" style={{ backgroundImage: "linear-gradient(135deg, rgba(255, 105, 0, 0.08) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function Dashboard4() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.999px] left-[7.99px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.12)] w-[94.55px]" data-name="Dashboard" />;
}

function Dashboard5() {
  return (
    <div className="absolute h-[11.987px] left-[7.99px] top-[7.99px] w-[13.195px]" data-name="Dashboard">
      <p className="-translate-x-1/2 absolute font-['Cousine:Bold',sans-serif] leading-[12px] left-[7.5px] not-italic text-[8px] text-[rgba(255,255,255,0.2)] text-center top-[0.49px]">TND</p>
    </div>
  );
}

function Container138() {
  return <div className="absolute bg-[rgba(240,144,48,0.35)] blur-[6px] h-[5.994px] left-[5.18px] rounded-[49888100px] top-[53.99px] w-[41.63px]" data-name="Container" />;
}

function Container139() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#c47020,0px_6px_8px_0px_rgba(240,144,48,0.35)] size-[51.991px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 179, 71) 0%, rgb(240, 144, 48) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container140() {
  return <div className="absolute h-[18.19px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.792px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 20.792 18.19\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(0 -1.8007 -2.0583 0 6.2375 5.4569)\'><stop stop-color=\'rgba(255,255,255,0.5)\' offset=\'0\'/><stop stop-color=\'rgba(191,191,191,0.375)\' offset=\'0.175\'/><stop stop-color=\'rgba(128,128,128,0.25)\' offset=\'0.35\'/><stop stop-color=\'rgba(64,64,64,0.125)\' offset=\'0.525\'/><stop stop-color=\'rgba(0,0,0,0)\' offset=\'0.7\'/></radialGradient></defs></svg>')" }} />;
}

function Icon36() {
  return (
    <div className="relative shrink-0 size-[25.995px]" data-name="Icon">
      <div className="absolute inset-[-7.37%_-11.22%_-15.07%_-11.23%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.8326 31.831">
          <g filter="url(#filter0_d_2159_1059)" id="Icon">
            <path d={svgPaths.p20781380} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p844400} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p3d3e3c80} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p2bcdc000} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p38de1930} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9954" id="filter0_d_2159_1059" width="33.9954" x="-1.07971" y="-1.08314">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2159_1059" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2159_1059" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container141() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.023px] size-[51.991px] top-0" data-name="Container">
      <Icon36 />
    </div>
  );
}

function Icon3D18() {
  return (
    <div className="absolute h-[59.982px] left-[29.27px] top-[11.96px] w-[51.991px]" data-name="Icon3D">
      <Container138 />
      <Container139 />
      <Container140 />
      <Container141 />
    </div>
  );
}

function Dashboard6() {
  return (
    <div className="absolute h-[12.475px] left-[20.4px] overflow-clip top-[86.09px] w-[69.716px]" data-name="Dashboard">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[12.5px] left-[35px] not-italic text-[#99a1af] text-[10px] text-center top-[-1.46px]" dir="auto">
        إنشاء مناقصة
      </p>
    </div>
  );
}

function Button32() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.487px] border-[rgba(255,105,0,0.2)] border-solid left-0 overflow-clip rounded-[22px] size-[113.506px] top-0" data-name="Button">
      <Dashboard3 />
      <Dashboard4 />
      <Dashboard5 />
      <Icon3D18 />
      <Dashboard6 />
    </div>
  );
}

function Dashboard7() {
  return <div className="absolute left-0 opacity-80 size-[110.556px] top-0" data-name="Dashboard" style={{ backgroundImage: "linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function Dashboard8() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.999px] left-[7.99px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.12)] w-[94.573px]" data-name="Dashboard" />;
}

function Dashboard9() {
  return (
    <div className="absolute h-[11.987px] left-[7.99px] top-[7.99px] w-[13.195px]" data-name="Dashboard">
      <p className="-translate-x-1/2 absolute font-['Cousine:Bold',sans-serif] leading-[12px] left-[7.5px] not-italic text-[8px] text-[rgba(255,255,255,0.2)] text-center top-[0.49px]">QTE</p>
    </div>
  );
}

function Container142() {
  return <div className="absolute bg-[rgba(212,175,55,0.35)] blur-[6px] h-[5.994px] left-[5.18px] rounded-[49888100px] top-[53.99px] w-[41.63px]" data-name="Container" />;
}

function Container143() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#a88a20,0px_6px_8px_0px_rgba(212,175,55,0.35)] size-[51.991px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 215, 0) 0%, rgb(212, 175, 55) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container144() {
  return <div className="absolute h-[18.19px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.792px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 20.792 18.19\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(0 -1.8007 -2.0583 0 6.2375 5.4569)\'><stop stop-color=\'rgba(255,255,255,0.55)\' offset=\'0\'/><stop stop-color=\'rgba(191,191,191,0.4125)\' offset=\'0.175\'/><stop stop-color=\'rgba(128,128,128,0.275)\' offset=\'0.35\'/><stop stop-color=\'rgba(64,64,64,0.1375)\' offset=\'0.525\'/><stop stop-color=\'rgba(0,0,0,0)\' offset=\'0.7\'/></radialGradient></defs></svg>')" }} />;
}

function Icon37() {
  return (
    <div className="relative shrink-0 size-[25.995px]" data-name="Icon">
      <div className="absolute inset-[-7.37%_0_-15.07%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25.9954 31.8291">
          <g filter="url(#filter0_d_2159_1016)" id="Icon">
            <path d="M12.9977 4.08314V25.746" id="Vector" stroke="var(--stroke-0, #5D4037)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.pa5e8a20} id="Vector_2" stroke="var(--stroke-0, #5D4037)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9954" id="filter0_d_2159_1016" width="33.9954" x="-4" y="-1.08314">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2159_1016" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2159_1016" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container145() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.023px] size-[51.991px] top-0" data-name="Container">
      <Icon37 />
    </div>
  );
}

function Icon3D19() {
  return (
    <div className="absolute h-[59.982px] left-[29.27px] top-[11.96px] w-[51.991px]" data-name="Icon3D">
      <Container142 />
      <Container143 />
      <Container144 />
      <Container145 />
    </div>
  );
}

function Dashboard10() {
  return (
    <div className="absolute h-[12.475px] left-[16.24px] overflow-clip top-[86.09px] w-[78.079px]" data-name="Dashboard">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[12.5px] left-[39.5px] not-italic text-[#99a1af] text-[10px] text-center top-[-1.46px]" dir="auto">
        إنشاء عرض سعر
      </p>
    </div>
  );
}

function Button33() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.487px] border-[rgba(212,175,55,0.2)] border-solid left-[123.5px] overflow-clip rounded-[22px] size-[113.53px] top-0" data-name="Button">
      <Dashboard7 />
      <Dashboard8 />
      <Dashboard9 />
      <Icon3D19 />
      <Dashboard10 />
    </div>
  );
}

function Dashboard11() {
  return <div className="absolute left-0 opacity-80 size-[110.533px] top-0" data-name="Dashboard" style={{ backgroundImage: "linear-gradient(135deg, rgba(0, 188, 125, 0.08) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function Dashboard12() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.999px] left-[7.99px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.12)] w-[94.55px]" data-name="Dashboard" />;
}

function Dashboard13() {
  return (
    <div className="absolute h-[11.987px] left-[7.99px] top-[7.99px] w-[13.195px]" data-name="Dashboard">
      <p className="-translate-x-1/2 absolute font-['Cousine:Bold',sans-serif] leading-[12px] left-[7.5px] not-italic text-[8px] text-[rgba(255,255,255,0.2)] text-center top-[0.49px]">CNT</p>
    </div>
  );
}

function Container146() {
  return <div className="absolute bg-[rgba(42,166,118,0.35)] blur-[6px] h-[5.994px] left-[5.18px] rounded-[49888100px] top-[53.99px] w-[41.63px]" data-name="Container" />;
}

function Container147() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#1d7a56,0px_6px_8px_0px_rgba(42,166,118,0.35)] size-[51.991px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(76, 208, 128) 0%, rgb(42, 166, 118) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container148() {
  return <div className="absolute h-[18.19px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.792px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 20.792 18.19\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(0 -1.8007 -2.0583 0 6.2375 5.4569)\'><stop stop-color=\'rgba(255,255,255,0.45)\' offset=\'0\'/><stop stop-color=\'rgba(191,191,191,0.3375)\' offset=\'0.175\'/><stop stop-color=\'rgba(128,128,128,0.225)\' offset=\'0.35\'/><stop stop-color=\'rgba(64,64,64,0.1125)\' offset=\'0.525\'/><stop stop-color=\'rgba(0,0,0,0)\' offset=\'0.7\'/></radialGradient></defs></svg>')" }} />;
}

function Icon38() {
  return (
    <div className="relative shrink-0 size-[25.995px]" data-name="Icon">
      <div className="absolute inset-[-7.39%_-11.24%_-15.07%_-11.22%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.8337 31.8342">
          <g filter="url(#filter0_d_2159_994)" id="Icon">
            <path d={svgPaths.p1aa8c700} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9954" id="filter0_d_2159_994" width="33.9954" x="-1.08264" y="-1.07914">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2159_994" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2159_994" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container149() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.023px] size-[51.991px] top-0" data-name="Container">
      <Icon38 />
    </div>
  );
}

function Icon3D20() {
  return (
    <div className="absolute h-[59.982px] left-[29.27px] top-[11.96px] w-[51.991px]" data-name="Icon3D">
      <Container146 />
      <Container147 />
      <Container148 />
      <Container149 />
    </div>
  );
}

function Dashboard14() {
  return (
    <div className="absolute h-[12.475px] left-[15.43px] overflow-clip top-[86.09px] w-[79.682px]" data-name="Dashboard">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[12.5px] left-[40px] not-italic text-[#99a1af] text-[10px] text-center top-[-1.46px]" dir="auto">
        البحث عن مقاول
      </p>
    </div>
  );
}

function Button34() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.487px] border-[rgba(0,188,125,0.2)] border-solid left-[247.01px] overflow-clip rounded-[22px] size-[113.506px] top-0" data-name="Button">
      <Dashboard11 />
      <Dashboard12 />
      <Dashboard13 />
      <Icon3D20 />
      <Dashboard14 />
    </div>
  );
}

function Dashboard15() {
  return <div className="absolute left-0 opacity-80 size-[110.533px] top-0" data-name="Dashboard" style={{ backgroundImage: "linear-gradient(135deg, rgba(43, 127, 255, 0.08) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function Dashboard16() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.999px] left-[7.99px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.12)] w-[94.55px]" data-name="Dashboard" />;
}

function Dashboard17() {
  return (
    <div className="absolute h-[11.987px] left-[7.99px] top-[7.99px] w-[13.195px]" data-name="Dashboard">
      <p className="-translate-x-1/2 absolute font-['Cousine:Bold',sans-serif] leading-[12px] left-[7.5px] not-italic text-[8px] text-[rgba(255,255,255,0.2)] text-center top-[0.49px]">PRD</p>
    </div>
  );
}

function Container150() {
  return <div className="absolute bg-[rgba(59,122,232,0.35)] blur-[6px] h-[5.994px] left-[5.18px] rounded-[49888100px] top-[53.99px] w-[41.63px]" data-name="Container" />;
}

function Container151() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#2a5db8,0px_6px_8px_0px_rgba(59,122,232,0.35)] size-[51.991px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(91, 156, 246) 0%, rgb(59, 122, 232) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container152() {
  return <div className="absolute h-[18.19px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.792px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 20.792 18.19\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(0 -1.8007 -2.0583 0 6.2375 5.4569)\'><stop stop-color=\'rgba(255,255,255,0.45)\' offset=\'0\'/><stop stop-color=\'rgba(191,191,191,0.3375)\' offset=\'0.175\'/><stop stop-color=\'rgba(128,128,128,0.225)\' offset=\'0.35\'/><stop stop-color=\'rgba(64,64,64,0.1125)\' offset=\'0.525\'/><stop stop-color=\'rgba(0,0,0,0)\' offset=\'0.7\'/></radialGradient></defs></svg>')" }} />;
}

function Icon39() {
  return (
    <div className="relative shrink-0 size-[25.995px]" data-name="Icon">
      <div className="absolute inset-[-7.37%_-7.05%_-15.07%_-7.05%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29.6629 31.8269">
          <g filter="url(#filter0_d_2159_1120)" id="Icon">
            <path d={svgPaths.pe5f9180} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d="M14.8314 25.7438V14.9124" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p1b740000} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p2f91afd0} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9954" id="filter0_d_2159_1120" width="33.9954" x="-2.16629" y="-1.08536">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2159_1120" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2159_1120" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container153() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.023px] size-[51.991px] top-0" data-name="Container">
      <Icon39 />
    </div>
  );
}

function Icon3D21() {
  return (
    <div className="absolute h-[59.982px] left-[29.27px] top-[11.96px] w-[51.991px]" data-name="Icon3D">
      <Container150 />
      <Container151 />
      <Container152 />
      <Container153 />
    </div>
  );
}

function Dashboard18() {
  return (
    <div className="absolute h-[12.475px] left-[19.75px] overflow-clip top-[86.09px] w-[71.017px]" data-name="Dashboard">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[12.5px] left-[36px] not-italic text-[#99a1af] text-[10px] text-center top-[-1.46px]" dir="auto">
        البحث عن منتج
      </p>
    </div>
  );
}

function Button35() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.487px] border-[rgba(43,127,255,0.2)] border-solid left-0 overflow-clip rounded-[22px] size-[113.506px] top-[123.52px]" data-name="Button">
      <Dashboard15 />
      <Dashboard16 />
      <Dashboard17 />
      <Icon3D21 />
      <Dashboard18 />
    </div>
  );
}

function Dashboard19() {
  return <div className="absolute left-0 opacity-80 size-[110.556px] top-0" data-name="Dashboard" style={{ backgroundImage: "linear-gradient(135deg, rgba(173, 70, 255, 0.08) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function Dashboard20() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.999px] left-[7.99px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.12)] w-[94.573px]" data-name="Dashboard" />;
}

function Dashboard21() {
  return (
    <div className="absolute h-[11.987px] left-[7.99px] top-[7.99px] w-[13.195px]" data-name="Dashboard">
      <p className="-translate-x-1/2 absolute font-['Cousine:Bold',sans-serif] leading-[12px] left-[7.5px] not-italic text-[8px] text-[rgba(255,255,255,0.2)] text-center top-[0.49px]">CST</p>
    </div>
  );
}

function Container154() {
  return <div className="absolute bg-[rgba(124,90,218,0.35)] blur-[6px] h-[5.994px] left-[5.18px] rounded-[49888100px] top-[53.99px] w-[41.63px]" data-name="Container" />;
}

function Container155() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#5a3db5,0px_6px_8px_0px_rgba(124,90,218,0.35)] size-[51.991px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(155, 122, 237) 0%, rgb(124, 90, 218) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container156() {
  return <div className="absolute h-[18.19px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.792px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 20.792 18.19\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(0 -1.8007 -2.0583 0 6.2375 5.4569)\'><stop stop-color=\'rgba(255,255,255,0.45)\' offset=\'0\'/><stop stop-color=\'rgba(191,191,191,0.3375)\' offset=\'0.175\'/><stop stop-color=\'rgba(128,128,128,0.225)\' offset=\'0.35\'/><stop stop-color=\'rgba(64,64,64,0.1125)\' offset=\'0.525\'/><stop stop-color=\'rgba(0,0,0,0)\' offset=\'0.7\'/></radialGradient></defs></svg>')" }} />;
}

function Icon40() {
  return (
    <div className="relative shrink-0 size-[25.995px]" data-name="Icon">
      <div className="absolute inset-[-3.21%_-9.96%_-10.9%_-11.22%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.5002 29.6629">
          <g filter="url(#filter0_d_2159_1041)" id="Icon">
            <path d={svgPaths.pdb6e380} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p1c21ae00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.pac99020} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p13650d80} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p35761ec0} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.pd444940} id="Vector_6" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p44fd980} id="Vector_7" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p3737980} id="Vector_8" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p3fb0e600} id="Vector_9" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p39db6080} id="Vector_10" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p35323f80} id="Vector_11" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9954" id="filter0_d_2159_1041" width="33.9954" x="-1.08314" y="-2.16629">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2159_1041" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2159_1041" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container157() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.023px] size-[51.991px] top-0" data-name="Container">
      <Icon40 />
    </div>
  );
}

function Icon3D22() {
  return (
    <div className="absolute h-[59.982px] left-[29.27px] top-[11.96px] w-[51.991px]" data-name="Icon3D">
      <Container154 />
      <Container155 />
      <Container156 />
      <Container157 />
    </div>
  );
}

function Dashboard22() {
  return (
    <div className="absolute h-[12.475px] left-[12.01px] overflow-clip top-[86.09px] w-[86.512px]" data-name="Dashboard">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[12.5px] left-[43.5px] not-italic text-[#99a1af] text-[10px] text-center top-[-1.46px]" dir="auto">
        البحث عن مستشار
      </p>
    </div>
  );
}

function Button36() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.487px] border-[rgba(173,70,255,0.2)] border-solid left-[123.5px] overflow-clip rounded-[22px] size-[113.53px] top-[123.52px]" data-name="Button">
      <Dashboard19 />
      <Dashboard20 />
      <Dashboard21 />
      <Icon3D22 />
      <Dashboard22 />
    </div>
  );
}

function Dashboard23() {
  return <div className="absolute left-0 opacity-80 size-[110.533px] top-0" data-name="Dashboard" style={{ backgroundImage: "linear-gradient(135deg, rgba(0, 184, 219, 0.08) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function Dashboard24() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.999px] left-[7.99px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.12)] w-[94.55px]" data-name="Dashboard" />;
}

function Dashboard25() {
  return (
    <div className="absolute h-[11.987px] left-[7.99px] top-[7.99px] w-[13.195px]" data-name="Dashboard">
      <p className="-translate-x-1/2 absolute font-['Cousine:Bold',sans-serif] leading-[12px] left-[7.5px] not-italic text-[8px] text-[rgba(255,255,255,0.2)] text-center top-[0.49px]">SRV</p>
    </div>
  );
}

function Container158() {
  return <div className="absolute bg-[rgba(38,198,218,0.35)] blur-[6px] h-[5.994px] left-[5.18px] rounded-[49888100px] top-[53.99px] w-[41.63px]" data-name="Container" />;
}

function Container159() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#1a9aad,0px_6px_8px_0px_rgba(38,198,218,0.35)] size-[51.991px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(77, 208, 225) 0%, rgb(38, 198, 218) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container160() {
  return <div className="absolute h-[18.19px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.792px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 20.792 18.19\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(0 -1.8007 -2.0583 0 6.2375 5.4569)\'><stop stop-color=\'rgba(255,255,255,0.5)\' offset=\'0\'/><stop stop-color=\'rgba(191,191,191,0.375)\' offset=\'0.175\'/><stop stop-color=\'rgba(128,128,128,0.25)\' offset=\'0.35\'/><stop stop-color=\'rgba(64,64,64,0.125)\' offset=\'0.525\'/><stop stop-color=\'rgba(0,0,0,0)\' offset=\'0.7\'/></radialGradient></defs></svg>')" }} />;
}

function Icon41() {
  return (
    <div className="relative shrink-0 size-[25.995px]" data-name="Icon">
      <div className="absolute inset-[-7.37%_-11.22%_-6.73%_-11.22%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.8291 29.6629">
          <g filter="url(#filter0_d_2159_988)" id="Icon">
            <path d={svgPaths.p275e1f00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.paccff00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9954" id="filter0_d_2159_988" width="33.9954" x="-1.08314" y="-1.08314">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2159_988" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2159_988" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container161() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.023px] size-[51.991px] top-0" data-name="Container">
      <Icon41 />
    </div>
  );
}

function Icon3D23() {
  return (
    <div className="absolute h-[59.982px] left-[29.27px] top-[11.96px] w-[51.991px]" data-name="Icon3D">
      <Container158 />
      <Container159 />
      <Container160 />
      <Container161 />
    </div>
  );
}

function Dashboard26() {
  return (
    <div className="absolute h-[12.475px] left-[18.1px] overflow-clip top-[86.09px] w-[74.316px]" data-name="Dashboard">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[12.5px] left-[37.5px] not-italic text-[#99a1af] text-[10px] text-center top-[-1.46px]" dir="auto">
        البحث عن خدمة
      </p>
    </div>
  );
}

function Button37() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.487px] border-[rgba(0,184,219,0.2)] border-solid left-[247.01px] overflow-clip rounded-[22px] size-[113.506px] top-[123.52px]" data-name="Button">
      <Dashboard23 />
      <Dashboard24 />
      <Dashboard25 />
      <Icon3D23 />
      <Dashboard26 />
    </div>
  );
}

function Dashboard27() {
  return <div className="absolute left-0 opacity-80 size-[110.533px] top-0" data-name="Dashboard" style={{ backgroundImage: "linear-gradient(135deg, rgba(251, 44, 54, 0.08) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function Dashboard28() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.999px] left-[7.99px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.12)] w-[94.55px]" data-name="Dashboard" />;
}

function Dashboard29() {
  return (
    <div className="absolute h-[11.987px] left-[7.99px] top-[7.99px] w-[13.195px]" data-name="Dashboard">
      <p className="-translate-x-1/2 absolute font-['Cousine:Bold',sans-serif] leading-[12px] left-[7.5px] not-italic text-[8px] text-[rgba(255,255,255,0.2)] text-center top-[0.49px]">OFR</p>
    </div>
  );
}

function Container162() {
  return <div className="absolute bg-[rgba(224,69,69,0.35)] blur-[6px] h-[5.994px] left-[5.18px] rounded-[49888100px] top-[53.99px] w-[41.63px]" data-name="Container" />;
}

function Container163() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#b33030,0px_6px_8px_0px_rgba(224,69,69,0.35)] size-[51.991px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 107, 107) 0%, rgb(224, 69, 69) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container164() {
  return <div className="absolute h-[18.19px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.792px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 20.792 18.19\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(0 -1.8007 -2.0583 0 6.2375 5.4569)\'><stop stop-color=\'rgba(255,255,255,0.45)\' offset=\'0\'/><stop stop-color=\'rgba(191,191,191,0.3375)\' offset=\'0.175\'/><stop stop-color=\'rgba(128,128,128,0.225)\' offset=\'0.35\'/><stop stop-color=\'rgba(64,64,64,0.1125)\' offset=\'0.525\'/><stop stop-color=\'rgba(0,0,0,0)\' offset=\'0.7\'/></radialGradient></defs></svg>')" }} />;
}

function Icon42() {
  return (
    <div className="relative shrink-0 size-[25.995px]" data-name="Icon">
      <div className="absolute inset-[-7.37%_-11.2%_-15.05%_-11.22%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.8239 31.8239">
          <g filter="url(#filter0_d_2159_1097)" id="Icon">
            <path d={svgPaths.p8fe9900} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p24907580} fill="var(--fill-0, white)" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9954" id="filter0_d_2159_1097" width="33.9954" x="-1.08314" y="-1.08314">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2159_1097" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2159_1097" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container165() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.023px] size-[51.991px] top-0" data-name="Container">
      <Icon42 />
    </div>
  );
}

function Icon3D24() {
  return (
    <div className="absolute h-[59.982px] left-[29.27px] top-[11.96px] w-[51.991px]" data-name="Icon3D">
      <Container162 />
      <Container163 />
      <Container164 />
      <Container165 />
    </div>
  );
}

function Dashboard30() {
  return (
    <div className="absolute h-[12.475px] left-[16.45px] overflow-clip top-[86.09px] w-[77.615px]" data-name="Dashboard">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[12.5px] left-[39px] not-italic text-[#99a1af] text-[10px] text-center top-[-1.46px]" dir="auto">
        البحث عن عروض
      </p>
    </div>
  );
}

function Button38() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.487px] border-[rgba(251,44,54,0.2)] border-solid left-0 overflow-clip rounded-[22px] size-[113.506px] top-[247.04px]" data-name="Button">
      <Dashboard27 />
      <Dashboard28 />
      <Dashboard29 />
      <Icon3D24 />
      <Dashboard30 />
    </div>
  );
}

function Dashboard31() {
  return <div className="absolute left-0 opacity-80 size-[110.556px] top-0" data-name="Dashboard" style={{ backgroundImage: "linear-gradient(135deg, rgba(0, 188, 125, 0.08) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function Dashboard32() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.999px] left-[7.99px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.12)] w-[94.573px]" data-name="Dashboard" />;
}

function Dashboard33() {
  return (
    <div className="absolute h-[11.987px] left-[7.99px] top-[7.99px] w-[13.195px]" data-name="Dashboard">
      <p className="-translate-x-1/2 absolute font-['Cousine:Bold',sans-serif] leading-[12px] left-[7.5px] not-italic text-[8px] text-[rgba(255,255,255,0.2)] text-center top-[0.49px]">ART</p>
    </div>
  );
}

function Container166() {
  return <div className="absolute bg-[rgba(67,160,71,0.35)] blur-[6px] h-[5.994px] left-[5.18px] rounded-[49888100px] top-[53.99px] w-[41.63px]" data-name="Container" />;
}

function Container167() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#2e7d32,0px_6px_8px_0px_rgba(67,160,71,0.35)] size-[51.991px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 187, 106) 0%, rgb(67, 160, 71) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container168() {
  return <div className="absolute h-[18.19px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.792px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 20.792 18.19\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'1\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(0 -1.8007 -2.0583 0 6.2375 5.4569)\'><stop stop-color=\'rgba(255,255,255,0.45)\' offset=\'0\'/><stop stop-color=\'rgba(191,191,191,0.3375)\' offset=\'0.175\'/><stop stop-color=\'rgba(128,128,128,0.225)\' offset=\'0.35\'/><stop stop-color=\'rgba(64,64,64,0.1125)\' offset=\'0.525\'/><stop stop-color=\'rgba(0,0,0,0)\' offset=\'0.7\'/></radialGradient></defs></svg>')" }} />;
}

function Icon43() {
  return (
    <div className="relative shrink-0 size-[25.995px]" data-name="Icon">
      <div className="absolute inset-[-7.37%_-9.49%_-13.34%_-11.22%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.3805 31.3805">
          <g filter="url(#filter0_d_2159_1035)" id="Icon">
            <path d={svgPaths.p27e10d80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p3d7d3280} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p32303580} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
            <path d={svgPaths.p2427e80} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16629" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9954" id="filter0_d_2159_1035" width="33.9954" x="-1.08314" y="-1.08314">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2159_1035" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2159_1035" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container169() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.023px] size-[51.991px] top-0" data-name="Container">
      <Icon43 />
    </div>
  );
}

function Icon3D25() {
  return (
    <div className="absolute h-[59.982px] left-[29.27px] top-[11.96px] w-[51.991px]" data-name="Icon3D">
      <Container166 />
      <Container167 />
      <Container168 />
      <Container169 />
    </div>
  );
}

function Dashboard34() {
  return (
    <div className="absolute h-[12.475px] left-[18.75px] overflow-clip top-[86.09px] w-[73.038px]" data-name="Dashboard">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[12.5px] left-[37px] not-italic text-[#99a1af] text-[10px] text-center top-[-1.46px]" dir="auto">
        البحث عن حرفي
      </p>
    </div>
  );
}

function Button39() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.487px] border-[rgba(0,188,125,0.2)] border-solid left-[123.5px] overflow-clip rounded-[22px] size-[113.53px] top-[247.04px]" data-name="Button">
      <Dashboard31 />
      <Dashboard32 />
      <Dashboard33 />
      <Icon3D25 />
      <Dashboard34 />
    </div>
  );
}

function Container137() {
  return (
    <div className="h-[360.568px] relative shrink-0 w-full" data-name="Container">
      <Button32 />
      <Button33 />
      <Button34 />
      <Button35 />
      <Button36 />
      <Button37 />
      <Button38 />
      <Button39 />
    </div>
  );
}

function Dashboard2() {
  return (
    <div className="content-stretch flex flex-col gap-[11.987px] h-[392.557px] items-start relative shrink-0 w-full" data-name="Dashboard">
      <Heading11 />
      <Container137 />
    </div>
  );
}

function Container125() {
  return (
    <div className="h-[712.307px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[19.979px] items-start pt-[7.991px] px-[15.983px] relative size-full">
        <Dashboard />
        <Dashboard1 />
        <Dashboard2 />
      </div>
    </div>
  );
}

function MainContent1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[779.956px] items-start left-0 overflow-clip top-[71.97px] w-[392.51px]" data-name="Main Content">
      <Container125 />
    </div>
  );
}

function Icon44() {
  return (
    <div className="relative shrink-0 size-[19.979px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9786 19.9786">
        <g id="Icon">
          <path d={svgPaths.p2bdc3880} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66488" />
          <path d={svgPaths.p15d41800} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66488" />
        </g>
      </svg>
    </div>
  );
}

function Button40() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] content-stretch flex items-center justify-center left-[340.54px] pr-[0.023px] rounded-[49888100px] size-[35.985px] top-[24px]" data-name="Button">
      <Icon44 />
    </div>
  );
}

function Icon45() {
  return (
    <div className="relative shrink-0 size-[16.982px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.9818 16.9818">
        <g id="Icon">
          <path d={svgPaths.p2cd7580} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.41515" />
          <path d={svgPaths.p282ad080} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.41515" />
        </g>
      </svg>
    </div>
  );
}

function Button41() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] relative rounded-[49888100px] shrink-0 size-[35.985px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon45 />
      </div>
    </div>
  );
}

function Icon46() {
  return (
    <div className="relative shrink-0 size-[16.982px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.9818 16.9818">
        <g clipPath="url(#clip0_2159_1026)" id="Icon">
          <path d={svgPaths.pe99b300} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.41515" />
        </g>
        <defs>
          <clipPath id="clip0_2159_1026">
            <rect fill="white" height="16.9818" width="16.9818" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button42() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] relative rounded-[49888100px] shrink-0 size-[35.985px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon46 />
      </div>
    </div>
  );
}

function Container170() {
  return (
    <div className="absolute content-stretch flex gap-[5.994px] h-[35.985px] items-center left-[15.98px] top-[24px] w-[77.963px]" data-name="Container">
      <Button41 />
      <Button42 />
    </div>
  );
}

function Heading12() {
  return (
    <div className="absolute h-[22.511px] left-[155.64px] top-[30.71px] w-[81.239px]" data-name="Heading 2">
      <p className="absolute font-['Cairo:Bold',sans-serif] font-bold leading-[22.5px] left-0 not-italic text-[15px] text-white top-[-0.97px]" dir="auto">
        لوحة التحكم
      </p>
    </div>
  );
}

function Header1() {
  return (
    <div className="absolute bg-[#0a0d0f] h-[71.969px] left-0 top-0 w-[392.51px]" data-name="Header">
      <Button40 />
      <Container170 />
      <Heading12 />
    </div>
  );
}

function ProjectsOverlay1() {
  return (
    <div className="absolute bg-[#0a0d0f] h-[851.925px] left-0 overflow-clip top-0 w-[392.51px]" data-name="ProjectsOverlay">
      <MainContent1 />
      <Header1 />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-white relative size-full" data-name="بيت الريف منصة البناء">
      <AppContent />
      <MobileLayout1 />
      <ProjectsOverlay />
      <AppContent1 />
      <ProjectsOverlay1 />
    </div>
  );
}