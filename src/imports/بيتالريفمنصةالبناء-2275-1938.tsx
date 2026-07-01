import svgPaths from "./svg-71fwzj96i1";
const imgImageUser = "/assets/user-placeholder.png";

function Container1() {
  return <div className="absolute bg-[rgba(42,166,118,0.08)] blur-[100px] left-[176.2px] rounded-[46422600px] size-[255.991px] top-[-85.22px]" data-name="Container" />;
}

function Container2() {
  return <div className="absolute bg-[rgba(212,175,55,0.06)] blur-[80px] left-[-39.28px] rounded-[46422600px] size-[191.983px] top-[745.47px]" data-name="Container" />;
}

function Text() {
  return (
    <div className="absolute h-[16.503px] left-[5.19px] top-[52.98px] w-[32.577px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[15px] left-[16px] not-italic text-[#2aa676] text-[10px] text-center top-[-1.04px]" dir="auto">
        موصى
      </p>
    </div>
  );
}

function Container6() {
  return <div className="absolute bg-[rgba(42,166,118,0.35)] blur-[5px] h-[5.493px] left-[4.4px] rounded-[46422600px] top-[46.2px] w-[35.193px]" data-name="Container" />;
}

function Container7() {
  return (
    <div className="absolute left-0 rounded-[10px] shadow-[0px_3px_0px_0px_#1d7a56,0px_5px_7px_0px_rgba(42,166,118,0.35)] size-[43.991px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(76, 208, 128) 0%, rgb(42, 166, 118) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container8() {
  return <div className="absolute h-[15.385px] left-[3.28px] rounded-bl-[5px] rounded-br-[10px] rounded-tl-[10px] rounded-tr-[5px] top-[3.28px] w-[17.596px]" data-name="Container" style={{ backgroundImage: "url(\'data:image/svg+xml;utf8,<svg viewBox=\\'0 0 17.596 15.385\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0 -1.523 -1.742 0 5.2789 4.6155)\\'><stop stop-color=\\'rgba(255,255,255,0.45)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(191,191,191,0.3375)\\' offset=\\'0.175\\'/><stop stop-color=\\'rgba(128,128,128,0.225)\\' offset=\\'0.35\\'/><stop stop-color=\\'rgba(64,64,64,0.1125)\\' offset=\\'0.525\\'/><stop stop-color=\\'rgba(0,0,0,0)\\' offset=\\'0.7\\'/></radialGradient></defs></svg>\')" }} />;
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[21.996px]" data-name="Icon">
      <div className="absolute inset-[-9.47%_-13.31%_-18.57%_-14.02%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.0068 28.1626">
          <g clipPath="url(#clip0_2275_1976)" filter="url(#filter0_d_2275_1976)" id="Icon">
            <path d="M9.49888 11.2483V22.2461" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83296" />
            <path d={svgPaths.p131f6f40} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83296" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="29.9955" id="filter0_d_2275_1976" width="29.9955" x="-0.91648" y="-0.91648">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2275_1976" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2275_1976" mode="normal" result="shape" />
            </filter>
            <clipPath id="clip0_2275_1976">
              <rect fill="white" height="21.9955" transform="translate(3.08352 2.08352)" width="21.9955" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.024px] size-[43.991px] top-0" data-name="Container">
      <Icon />
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute h-[51.695px] left-0 top-0 w-[43.991px]" data-name="Container">
      <Container6 />
      <Container7 />
      <Container8 />
      <Container9 />
    </div>
  );
}

function Button() {
  return (
    <div className="h-[74.8px] relative shrink-0 w-[44px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text />
        <Container5 />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute h-[15.002px] left-[6.25px] top-[52.98px] w-[27.475px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[15px] left-[14px] not-italic text-[#6a7282] text-[10px] text-center top-[-0.77px]" dir="auto">
        المميز
      </p>
    </div>
  );
}

function Container11() {
  return <div className="absolute bg-[rgba(59,122,232,0.35)] blur-[5px] h-[4.994px] left-[4px] rounded-[46422600px] top-[42px] w-[31.993px]" data-name="Container" />;
}

function Container12() {
  return (
    <div className="absolute left-0 rounded-[10px] shadow-[0px_3px_0px_0px_#2a5db8,0px_5px_7px_0px_rgba(59,122,232,0.35)] size-[39.992px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(91, 156, 246) 0%, rgb(59, 122, 232) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container13() {
  return <div className="absolute h-[13.986px] left-[2.98px] rounded-bl-[5px] rounded-br-[10px] rounded-tl-[10px] rounded-tr-[5px] top-[2.98px] w-[15.997px]" data-name="Container" style={{ backgroundImage: "url(\'data:image/svg+xml;utf8,<svg viewBox=\\'0 0 15.997 13.986\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0 -1.3846 -1.5836 0 4.799 4.1959)\\'><stop stop-color=\\'rgba(255,255,255,0.45)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(191,191,191,0.3375)\\' offset=\\'0.175\\'/><stop stop-color=\\'rgba(128,128,128,0.225)\\' offset=\\'0.35\\'/><stop stop-color=\\'rgba(64,64,64,0.1125)\\' offset=\\'0.525\\'/><stop stop-color=\\'rgba(0,0,0,0)\\' offset=\\'0.7\\'/></radialGradient></defs></svg>\')" }} />;
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[19.996px]" data-name="Icon">
      <div className="absolute inset-[-10.84%_0_-20.84%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9959 26.329">
          <g clipPath="url(#clip0_2275_1998)" filter="url(#filter0_d_2275_1998)" id="Icon">
            <path d={svgPaths.p364e2160} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66633" />
            <path d={svgPaths.p6fd6100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66633" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="27.9959" id="filter0_d_2275_1998" width="27.9959" x="-4" y="-0.833164">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2275_1998" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2275_1998" mode="normal" result="shape" />
            </filter>
            <clipPath id="clip0_2275_1998">
              <rect fill="white" height="19.9959" transform="translate(0 2.16684)" width="19.9959" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.022px] size-[39.992px] top-0" data-name="Container">
      <Icon1 />
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute h-[46.996px] left-0 top-0 w-[39.992px]" data-name="Container">
      <Container11 />
      <Container12 />
      <Container13 />
      <Container14 />
    </div>
  );
}

function Button1() {
  return (
    <div className="h-[67.986px] opacity-60 relative shrink-0 w-[39.992px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text1 />
        <Container10 />
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute h-[15.002px] left-0 top-[52.98px] w-[43.969px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[15px] left-[22px] not-italic text-[#6a7282] text-[10px] text-center top-[-0.77px]" dir="auto">
        قريب مني
      </p>
    </div>
  );
}

function Container16() {
  return <div className="absolute bg-[rgba(59,122,232,0.35)] blur-[5px] h-[4.994px] left-[4px] rounded-[46422600px] top-[42px] w-[31.993px]" data-name="Container" />;
}

function Container17() {
  return (
    <div className="absolute left-0 rounded-[10px] shadow-[0px_3px_0px_0px_#2a5db8,0px_5px_7px_0px_rgba(59,122,232,0.35)] size-[39.992px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(91, 156, 246) 0%, rgb(59, 122, 232) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container18() {
  return <div className="absolute h-[13.986px] left-[2.98px] rounded-bl-[5px] rounded-br-[10px] rounded-tl-[10px] rounded-tr-[5px] top-[2.98px] w-[15.997px]" data-name="Container" style={{ backgroundImage: "url(\'data:image/svg+xml;utf8,<svg viewBox=\\'0 0 15.997 13.986\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0 -1.3846 -1.5836 0 4.799 4.1959)\\'><stop stop-color=\\'rgba(255,255,255,0.45)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(191,191,191,0.3375)\\' offset=\\'0.175\\'/><stop stop-color=\\'rgba(128,128,128,0.225)\\' offset=\\'0.35\\'/><stop stop-color=\\'rgba(64,64,64,0.1125)\\' offset=\\'0.525\\'/><stop stop-color=\\'rgba(0,0,0,0)\\' offset=\\'0.7\\'/></radialGradient></defs></svg>\')" }} />;
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[19.996px]" data-name="Icon">
      <div className="absolute inset-[-10.84%_-7.5%_-20.84%_-7.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.9969 26.3294">
          <g clipPath="url(#clip0_2275_1972)" filter="url(#filter0_d_2275_1972)" id="Icon">
            <path d={svgPaths.p2d7165f0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66633" />
            <path d={svgPaths.p3d059e00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66633" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="27.9959" id="filter0_d_2275_1972" width="27.9959" x="-2.49949" y="-0.833164">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2275_1972" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2275_1972" mode="normal" result="shape" />
            </filter>
            <clipPath id="clip0_2275_1972">
              <rect fill="white" height="19.9959" transform="translate(1.50051 2.16684)" width="19.9959" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.022px] size-[39.992px] top-0" data-name="Container">
      <Icon2 />
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute h-[46.996px] left-[1.99px] top-0 w-[39.992px]" data-name="Container">
      <Container16 />
      <Container17 />
      <Container18 />
      <Container19 />
    </div>
  );
}

function Button2() {
  return (
    <div className="h-[67.986px] opacity-60 relative shrink-0 w-[43.969px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text2 />
        <Container15 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex gap-[21.996px] h-[67.986px] items-center justify-center left-0 pr-[2px] top-0 w-[360.921px]" data-name="Container">
      <Button />
      <Button1 />
      <Button2 />
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[27.994px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="-translate-x-full absolute font-['Cairo:Bold',sans-serif] font-bold leading-[28px] left-[361.8px] not-italic text-[18px] text-right text-white top-[0.23px]" dir="auto">
        ماذا تريد أن تفعل اليوم؟
      </p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[15.997px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-full absolute font-['Cairo:Regular',sans-serif] font-normal leading-[16px] left-[361.43px] not-italic text-[#6a7282] text-[12px] text-right top-[-1.15px]" dir="auto">
        صباح الخير أحمد الفارس
      </p>
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[1.989px] h-[45.98px] items-start left-0 top-[154.71px] w-[360.921px]" data-name="Container">
      <Heading />
      <Paragraph />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[19.996px] relative shrink-0 w-[90.749px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Cairo:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[14px] text-white top-[-1.15px]" dir="auto">
          إجراءات سريعة
        </p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[19.996px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pl-[270.172px] relative size-full">
          <Heading1 />
        </div>
      </div>
    </div>
  );
}

function Container25() {
  return <div className="absolute left-0 size-[110.875px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgba(0, 188, 125, 0.06) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function Container26() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.994px] left-[8px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.1)] w-[94.878px]" data-name="Container" />;
}

function Container28() {
  return <div className="absolute bg-[rgba(42,166,118,0.35)] blur-[6px] h-[5.988px] left-[5.19px] rounded-[46422600px] top-[54px] w-[41.613px]" data-name="Container" />;
}

function Container29() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#1d7a56,0px_6px_8px_0px_rgba(42,166,118,0.35)] size-[51.989px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(76, 208, 128) 0%, rgb(42, 166, 118) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container30() {
  return <div className="absolute h-[18.18px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.796px]" data-name="Container" style={{ backgroundImage: "url(\'data:image/svg+xml;utf8,<svg viewBox=\\'0 0 20.796 18.18\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0 -1.7997 -2.0587 0 6.2387 5.454)\\'><stop stop-color=\\'rgba(255,255,255,0.45)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(191,191,191,0.3375)\\' offset=\\'0.175\\'/><stop stop-color=\\'rgba(128,128,128,0.225)\\' offset=\\'0.35\\'/><stop stop-color=\\'rgba(64,64,64,0.1125)\\' offset=\\'0.525\\'/><stop stop-color=\\'rgba(0,0,0,0)\\' offset=\\'0.7\\'/></radialGradient></defs></svg>\')" }} />;
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[25.984px]" data-name="Icon">
      <div className="absolute inset-[-7.39%_-11.24%_-10.91%_-7.07%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30.7413 30.7413">
          <g filter="url(#filter0_d_2275_2032)" id="Icon">
            <path d={svgPaths.p2b3d6a00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9839" id="filter0_d_2275_2032" width="33.9839" x="-2.1639" y="-1.07872">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2275_2032" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2275_2032" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.022px] size-[51.989px] top-0" data-name="Container">
      <Icon3 />
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute h-[59.988px] left-[29.44px] top-[13.12px] w-[51.989px]" data-name="Container">
      <Container28 />
      <Container29 />
      <Container30 />
      <Container31 />
    </div>
  );
}

function Text3() {
  return (
    <div className="absolute h-[11.241px] left-[29.12px] overflow-clip top-[86.49px] w-[52.638px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[11.25px] left-[26.5px] not-italic text-[9px] text-[rgba(255,255,255,0.8)] text-center top-[0.23px]" dir="auto">
        اطلب خدمة
      </p>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.383px] border-[rgba(0,188,125,0.15)] border-solid left-0 overflow-clip rounded-[22px] size-[113.642px] top-0" data-name="Button">
      <Container25 />
      <Container26 />
      <Container27 />
      <Text3 />
    </div>
  );
}

function Container32() {
  return <div className="absolute left-0 size-[110.875px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgba(212, 175, 55, 0.06) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function Container33() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.994px] left-[8px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.1)] w-[94.878px]" data-name="Container" />;
}

function Container35() {
  return <div className="absolute bg-[rgba(212,175,55,0.35)] blur-[6px] h-[5.988px] left-[5.19px] rounded-[46422600px] top-[54px] w-[41.613px]" data-name="Container" />;
}

function Container36() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#a88a20,0px_6px_8px_0px_rgba(212,175,55,0.35)] size-[51.989px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 215, 0) 0%, rgb(212, 175, 55) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container37() {
  return <div className="absolute h-[18.18px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.796px]" data-name="Container" style={{ backgroundImage: "url(\'data:image/svg+xml;utf8,<svg viewBox=\\'0 0 20.796 18.18\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0 -1.7997 -2.0587 0 6.2387 5.454)\\'><stop stop-color=\\'rgba(255,255,255,0.55)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(191,191,191,0.4125)\\' offset=\\'0.175\\'/><stop stop-color=\\'rgba(128,128,128,0.275)\\' offset=\\'0.35\\'/><stop stop-color=\\'rgba(64,64,64,0.1375)\\' offset=\\'0.525\\'/><stop stop-color=\\'rgba(0,0,0,0)\\' offset=\\'0.7\\'/></radialGradient></defs></svg>\')" }} />;
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[25.984px]" data-name="Icon">
      <div className="absolute inset-[-7.38%_-2.89%_-15.08%_-2.89%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.4879 31.8186">
          <g filter="url(#filter0_d_2275_2016)" id="Icon">
            <path d={svgPaths.pfa2c400} id="Vector" stroke="var(--stroke-0, #5D4037)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d={svgPaths.p37cbd580} id="Vector_2" stroke="var(--stroke-0, #5D4037)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d="M11.5786 11.6613H9.41331" id="Vector_3" stroke="var(--stroke-0, #5D4037)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d="M18.0746 15.9919H9.41331" id="Vector_4" stroke="var(--stroke-0, #5D4037)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d="M18.0746 20.3226H9.41331" id="Vector_5" stroke="var(--stroke-0, #5D4037)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9839" id="filter0_d_2275_2016" width="33.9839" x="-3.24799" y="-1.08266">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2275_2016" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2275_2016" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.022px] size-[51.989px] top-0" data-name="Container">
      <Icon4 />
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute h-[59.988px] left-[29.44px] top-[13.12px] w-[51.989px]" data-name="Container">
      <Container35 />
      <Container36 />
      <Container37 />
      <Container38 />
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute h-[11.241px] left-[20.56px] overflow-clip top-[86.49px] w-[69.737px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[11.25px] left-[35px] not-italic text-[9px] text-[rgba(255,255,255,0.8)] text-center top-[0.23px]" dir="auto">
        اطلب عرض سعر
      </p>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.383px] border-[rgba(212,175,55,0.15)] border-solid left-[123.63px] overflow-clip rounded-[22px] size-[113.642px] top-0" data-name="Button">
      <Container32 />
      <Container33 />
      <Container34 />
      <Text4 />
    </div>
  );
}

function Container39() {
  return <div className="absolute left-0 size-[110.896px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgba(255, 105, 0, 0.06) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function Container40() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.994px] left-[8px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.1)] w-[94.9px]" data-name="Container" />;
}

function Container42() {
  return <div className="absolute bg-[rgba(240,144,48,0.35)] blur-[6px] h-[5.988px] left-[5.19px] rounded-[46422600px] top-[54px] w-[41.613px]" data-name="Container" />;
}

function Container43() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#c47020,0px_6px_8px_0px_rgba(240,144,48,0.35)] size-[51.989px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 179, 71) 0%, rgb(240, 144, 48) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container44() {
  return <div className="absolute h-[18.18px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.796px]" data-name="Container" style={{ backgroundImage: "url(\'data:image/svg+xml;utf8,<svg viewBox=\\'0 0 20.796 18.18\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0 -1.7997 -2.0587 0 6.2387 5.454)\\'><stop stop-color=\\'rgba(255,255,255,0.5)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(191,191,191,0.375)\\' offset=\\'0.175\\'/><stop stop-color=\\'rgba(128,128,128,0.25)\\' offset=\\'0.35\\'/><stop stop-color=\\'rgba(64,64,64,0.125)\\' offset=\\'0.525\\'/><stop stop-color=\\'rgba(0,0,0,0)\\' offset=\\'0.7\\'/></radialGradient></defs></svg>\')" }} />;
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[25.984px]" data-name="Icon">
      <div className="absolute inset-[-7.38%_-7.06%_-15.08%_-7.06%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29.6532 31.8186">
          <g filter="url(#filter0_d_2275_2060)" id="Icon">
            <path d={svgPaths.p27f092e0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d="M5.08266 8.41331H24.5706" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d={svgPaths.p35711600} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9839" id="filter0_d_2275_2060" width="33.9839" x="-2.16533" y="-1.08266">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2275_2060" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2275_2060" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.022px] size-[51.989px] top-0" data-name="Container">
      <Icon5 />
    </div>
  );
}

function Container41() {
  return (
    <div className="absolute h-[59.988px] left-[29.44px] top-[13.14px] w-[51.989px]" data-name="Container">
      <Container42 />
      <Container43 />
      <Container44 />
      <Container45 />
    </div>
  );
}

function Text5() {
  return (
    <div className="absolute h-[11.241px] left-[28.08px] overflow-clip top-[86.51px] w-[54.713px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[11.25px] left-[27.5px] not-italic text-[9px] text-[rgba(255,255,255,0.8)] text-center top-[0.23px]" dir="auto">
        اشتري منتج
      </p>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.383px] border-[rgba(255,105,0,0.15)] border-solid left-[247.26px] overflow-clip rounded-[22px] size-[113.663px] top-0" data-name="Button">
      <Container39 />
      <Container40 />
      <Container41 />
      <Text5 />
    </div>
  );
}

function Container46() {
  return <div className="absolute left-0 size-[110.875px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgba(43, 127, 255, 0.06) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function Container47() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.994px] left-[8px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.1)] w-[94.878px]" data-name="Container" />;
}

function Container49() {
  return <div className="absolute bg-[rgba(59,122,232,0.35)] blur-[6px] h-[5.988px] left-[5.19px] rounded-[46422600px] top-[54px] w-[41.613px]" data-name="Container" />;
}

function Container50() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#2a5db8,0px_6px_8px_0px_rgba(59,122,232,0.35)] size-[51.989px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(91, 156, 246) 0%, rgb(59, 122, 232) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container51() {
  return <div className="absolute h-[18.18px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.796px]" data-name="Container" style={{ backgroundImage: "url(\'data:image/svg+xml;utf8,<svg viewBox=\\'0 0 20.796 18.18\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0 -1.7997 -2.0587 0 6.2387 5.454)\\'><stop stop-color=\\'rgba(255,255,255,0.45)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(191,191,191,0.3375)\\' offset=\\'0.175\\'/><stop stop-color=\\'rgba(128,128,128,0.225)\\' offset=\\'0.35\\'/><stop stop-color=\\'rgba(64,64,64,0.1125)\\' offset=\\'0.525\\'/><stop stop-color=\\'rgba(0,0,0,0)\\' offset=\\'0.7\\'/></radialGradient></defs></svg>\')" }} />;
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[25.984px]" data-name="Icon">
      <div className="absolute inset-[-7.38%_-11.23%_-6.74%_-11.23%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.8186 29.6532">
          <g filter="url(#filter0_d_2275_1942)" id="Icon">
            <path d={svgPaths.p3d653780} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d={svgPaths.p3f411280} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9839" id="filter0_d_2275_1942" width="33.9839" x="-1.08266" y="-1.08266">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2275_1942" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2275_1942" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.022px] size-[51.989px] top-0" data-name="Container">
      <Icon6 />
    </div>
  );
}

function Container48() {
  return (
    <div className="absolute h-[59.988px] left-[29.44px] top-[13.12px] w-[51.989px]" data-name="Container">
      <Container49 />
      <Container50 />
      <Container51 />
      <Container52 />
    </div>
  );
}

function Text6() {
  return (
    <div className="absolute h-[11.241px] left-[30.09px] overflow-clip top-[86.49px] w-[50.671px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[11.25px] left-[25.5px] not-italic text-[9px] text-[rgba(255,255,255,0.8)] text-center top-[0.23px]" dir="auto">
        بدء مشروع
      </p>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.383px] border-[rgba(43,127,255,0.15)] border-solid left-0 overflow-clip rounded-[22px] size-[113.642px] top-[123.65px]" data-name="Button">
      <Container46 />
      <Container47 />
      <Container48 />
      <Text6 />
    </div>
  );
}

function Container53() {
  return <div className="absolute left-0 size-[110.875px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgba(173, 70, 255, 0.06) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function Container54() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.994px] left-[8px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.1)] w-[94.878px]" data-name="Container" />;
}

function Container56() {
  return <div className="absolute bg-[rgba(124,90,218,0.35)] blur-[6px] h-[5.988px] left-[5.19px] rounded-[46422600px] top-[54px] w-[41.613px]" data-name="Container" />;
}

function Container57() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#5a3db5,0px_6px_8px_0px_rgba(124,90,218,0.35)] size-[51.989px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(155, 122, 237) 0%, rgb(124, 90, 218) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container58() {
  return <div className="absolute h-[18.18px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.796px]" data-name="Container" style={{ backgroundImage: "url(\'data:image/svg+xml;utf8,<svg viewBox=\\'0 0 20.796 18.18\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0 -1.7997 -2.0587 0 6.2387 5.454)\\'><stop stop-color=\\'rgba(255,255,255,0.45)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(191,191,191,0.3375)\\' offset=\\'0.175\\'/><stop stop-color=\\'rgba(128,128,128,0.225)\\' offset=\\'0.35\\'/><stop stop-color=\\'rgba(64,64,64,0.1125)\\' offset=\\'0.525\\'/><stop stop-color=\\'rgba(0,0,0,0)\\' offset=\\'0.7\\'/></radialGradient></defs></svg>\')" }} />;
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[25.984px]" data-name="Icon">
      <div className="absolute inset-[-7.38%_-11.23%_-15.08%_-11.23%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.8186 31.8186">
          <g filter="url(#filter0_d_2275_2065)" id="Icon">
            <path d={svgPaths.p2056f400} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d={svgPaths.p20dcb1f0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9839" id="filter0_d_2275_2065" width="33.9839" x="-1.08266" y="-1.08266">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2275_2065" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2275_2065" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.022px] size-[51.989px] top-0" data-name="Container">
      <Icon7 />
    </div>
  );
}

function Container55() {
  return (
    <div className="absolute h-[59.988px] left-[29.44px] top-[13.12px] w-[51.989px]" data-name="Container">
      <Container56 />
      <Container57 />
      <Container58 />
      <Container59 />
    </div>
  );
}

function Text7() {
  return (
    <div className="absolute h-[11.241px] left-[20.08px] overflow-clip top-[86.49px] w-[70.688px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[11.25px] left-[35.5px] not-italic text-[9px] text-[rgba(255,255,255,0.8)] text-center top-[0.23px]" dir="auto">
        استكشف حولك
      </p>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.383px] border-[rgba(173,70,255,0.15)] border-solid left-[123.63px] overflow-clip rounded-[22px] size-[113.642px] top-[123.65px]" data-name="Button">
      <Container53 />
      <Container54 />
      <Container55 />
      <Text7 />
    </div>
  );
}

function Container60() {
  return <div className="absolute left-0 size-[110.896px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgba(0, 188, 125, 0.06) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function Container61() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.994px] left-[8px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.1)] w-[94.9px]" data-name="Container" />;
}

function Container63() {
  return <div className="absolute bg-[rgba(67,160,71,0.35)] blur-[6px] h-[5.988px] left-[5.19px] rounded-[46422600px] top-[54px] w-[41.613px]" data-name="Container" />;
}

function Container64() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#2e7d32,0px_6px_8px_0px_rgba(67,160,71,0.35)] size-[51.989px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 187, 106) 0%, rgb(67, 160, 71) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container65() {
  return <div className="absolute h-[18.18px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.796px]" data-name="Container" style={{ backgroundImage: "url(\'data:image/svg+xml;utf8,<svg viewBox=\\'0 0 20.796 18.18\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0 -1.7997 -2.0587 0 6.2387 5.454)\\'><stop stop-color=\\'rgba(255,255,255,0.45)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(191,191,191,0.3375)\\' offset=\\'0.175\\'/><stop stop-color=\\'rgba(128,128,128,0.225)\\' offset=\\'0.35\\'/><stop stop-color=\\'rgba(64,64,64,0.1125)\\' offset=\\'0.525\\'/><stop stop-color=\\'rgba(0,0,0,0)\\' offset=\\'0.7\\'/></radialGradient></defs></svg>\')" }} />;
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[25.984px]" data-name="Icon">
      <div className="absolute inset-[0_-11.23%_-6.74%_-11.23%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.8186 27.7359">
          <g filter="url(#filter0_d_2275_2052)" id="Icon">
            <path d={svgPaths.p1b1cd500} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d={svgPaths.p3004c480} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d="M5.08266 15.1573H7.24799" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d="M24.5706 15.1573H26.7359" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d="M19.1573 14.0746V16.2399" id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d="M12.6613 14.0746V16.2399" id="Vector_6" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9839" id="filter0_d_2275_2052" width="33.9839" x="-1.08266" y="-3">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2275_2052" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2275_2052" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.022px] size-[51.989px] top-0" data-name="Container">
      <Icon8 />
    </div>
  );
}

function Container62() {
  return (
    <div className="absolute h-[59.988px] left-[29.44px] top-[13.14px] w-[51.989px]" data-name="Container">
      <Container63 />
      <Container64 />
      <Container65 />
      <Container66 />
    </div>
  );
}

function Text8() {
  return (
    <div className="absolute h-[11.241px] left-[16.54px] overflow-clip top-[86.51px] w-[77.8px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[11.25px] left-[39px] not-italic text-[9px] text-[rgba(255,255,255,0.8)] text-center top-[0.23px]" dir="auto">
        استشارة مع وياك
      </p>
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.383px] border-[rgba(0,188,125,0.15)] border-solid left-[247.26px] overflow-clip rounded-[22px] size-[113.663px] top-[123.65px]" data-name="Button">
      <Container60 />
      <Container61 />
      <Container62 />
      <Text8 />
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[237.314px] relative shrink-0 w-full" data-name="Container">
      <Button3 />
      <Button4 />
      <Button5 />
      <Button6 />
      <Button7 />
      <Button8 />
    </div>
  );
}

function Container22() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[360.921px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[11.998px] items-start relative size-full">
        <Container23 />
        <Container24 />
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute content-stretch flex flex-col h-[269.307px] items-start left-0 top-[220.69px] w-[360.921px]" data-name="Container">
      <Container22 />
    </div>
  );
}

function Button9() {
  return (
    <div className="h-[15.002px] relative shrink-0 w-[41.656px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[15px] left-[21px] not-italic text-[#2aa676] text-[10px] text-center top-[-0.77px]" dir="auto">
          رؤية الكل
        </p>
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[19.996px] relative shrink-0 w-[50.93px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Cairo:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[14px] text-white top-[-1.15px]" dir="auto">
          الخدمات
        </p>
      </div>
    </div>
  );
}

function Container68() {
  return (
    <div className="content-stretch flex h-[19.996px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Button9 />
      <Heading2 />
    </div>
  );
}

function Container70() {
  return <div className="absolute left-0 size-[110.875px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgba(255, 105, 0, 0.06) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function Container71() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.994px] left-[8px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.1)] w-[94.878px]" data-name="Container" />;
}

function Container73() {
  return <div className="absolute bg-[rgba(240,144,48,0.35)] blur-[6px] h-[5.988px] left-[5.19px] rounded-[46422600px] top-[54px] w-[41.613px]" data-name="Container" />;
}

function Container74() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#c47020,0px_6px_8px_0px_rgba(240,144,48,0.35)] size-[51.989px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 179, 71) 0%, rgb(240, 144, 48) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container75() {
  return <div className="absolute h-[18.18px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.796px]" data-name="Container" style={{ backgroundImage: "url(\'data:image/svg+xml;utf8,<svg viewBox=\\'0 0 20.796 18.18\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0 -1.7997 -2.0587 0 6.2387 5.454)\\'><stop stop-color=\\'rgba(255,255,255,0.5)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(191,191,191,0.375)\\' offset=\\'0.175\\'/><stop stop-color=\\'rgba(128,128,128,0.25)\\' offset=\\'0.35\\'/><stop stop-color=\\'rgba(64,64,64,0.125)\\' offset=\\'0.525\\'/><stop stop-color=\\'rgba(0,0,0,0)\\' offset=\\'0.7\\'/></radialGradient></defs></svg>\')" }} />;
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[25.984px]" data-name="Icon">
      <div className="absolute inset-[-7.38%_-11.23%_-15.08%_-11.23%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.8186 31.8186">
          <g filter="url(#filter0_d_2275_2043)" id="Icon">
            <path d={svgPaths.p3a73f300} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d={svgPaths.p26f63500} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d={svgPaths.p4490580} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d="M13.744 8.41331H18.0746" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d="M13.744 12.744H18.0746" id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d="M13.744 17.0746H18.0746" id="Vector_6" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d="M13.744 21.4053H18.0746" id="Vector_7" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9839" id="filter0_d_2275_2043" width="33.9839" x="-1.08266" y="-1.08266">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2275_2043" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2275_2043" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container76() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.022px] size-[51.989px] top-0" data-name="Container">
      <Icon9 />
    </div>
  );
}

function Container72() {
  return (
    <div className="absolute h-[59.988px] left-[29.44px] top-[13.12px] w-[51.989px]" data-name="Container">
      <Container73 />
      <Container74 />
      <Container75 />
      <Container76 />
    </div>
  );
}

function Text9() {
  return (
    <div className="absolute h-[11.241px] left-[23.43px] overflow-clip top-[86.49px] w-[64.009px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[11.25px] left-[32.5px] not-italic text-[9px] text-[rgba(255,255,255,0.8)] text-center top-[0.23px]" dir="auto">
        مقاولات البناء
      </p>
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.383px] border-[rgba(255,105,0,0.15)] border-solid left-0 overflow-clip rounded-[22px] size-[113.642px] top-0" data-name="Button">
      <Container70 />
      <Container71 />
      <Container72 />
      <Text9 />
    </div>
  );
}

function Container77() {
  return <div className="absolute left-0 size-[110.875px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgba(43, 127, 255, 0.06) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function Container78() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.994px] left-[8px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.1)] w-[94.878px]" data-name="Container" />;
}

function Container80() {
  return <div className="absolute bg-[rgba(59,122,232,0.35)] blur-[6px] h-[5.988px] left-[5.19px] rounded-[46422600px] top-[54px] w-[41.613px]" data-name="Container" />;
}

function Container81() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#2a5db8,0px_6px_8px_0px_rgba(59,122,232,0.35)] size-[51.989px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(91, 156, 246) 0%, rgb(59, 122, 232) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container82() {
  return <div className="absolute h-[18.18px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.796px]" data-name="Container" style={{ backgroundImage: "url(\'data:image/svg+xml;utf8,<svg viewBox=\\'0 0 20.796 18.18\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0 -1.7997 -2.0587 0 6.2387 5.454)\\'><stop stop-color=\\'rgba(255,255,255,0.45)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(191,191,191,0.3375)\\' offset=\\'0.175\\'/><stop stop-color=\\'rgba(128,128,128,0.225)\\' offset=\\'0.35\\'/><stop stop-color=\\'rgba(64,64,64,0.1125)\\' offset=\\'0.525\\'/><stop stop-color=\\'rgba(0,0,0,0)\\' offset=\\'0.7\\'/></radialGradient></defs></svg>\')" }} />;
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[25.984px]" data-name="Icon">
      <div className="absolute inset-[-7.38%_-11.23%_-15.08%_-11.23%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.8186 31.8186">
          <g filter="url(#filter0_d_2275_2065)" id="Icon">
            <path d={svgPaths.p2056f400} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d={svgPaths.p20dcb1f0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9839" id="filter0_d_2275_2065" width="33.9839" x="-1.08266" y="-1.08266">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2275_2065" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2275_2065" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container83() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.022px] size-[51.989px] top-0" data-name="Container">
      <Icon10 />
    </div>
  );
}

function Container79() {
  return (
    <div className="absolute h-[59.988px] left-[29.44px] top-[13.12px] w-[51.989px]" data-name="Container">
      <Container80 />
      <Container81 />
      <Container82 />
      <Container83 />
    </div>
  );
}

function Text10() {
  return (
    <div className="absolute h-[11.241px] left-[8.89px] overflow-clip top-[86.49px] w-[93.084px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[11.25px] left-[47px] not-italic text-[9px] text-[rgba(255,255,255,0.8)] text-center top-[0.23px]" dir="auto">
        الاستشارات الهندسية
      </p>
    </div>
  );
}

function Button11() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.383px] border-[rgba(43,127,255,0.15)] border-solid left-[123.63px] overflow-clip rounded-[22px] size-[113.642px] top-0" data-name="Button">
      <Container77 />
      <Container78 />
      <Container79 />
      <Text10 />
    </div>
  );
}

function Container84() {
  return <div className="absolute left-0 size-[110.896px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgba(0, 188, 125, 0.06) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function Container85() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.994px] left-[8px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.1)] w-[94.9px]" data-name="Container" />;
}

function Container87() {
  return <div className="absolute bg-[rgba(42,166,118,0.35)] blur-[6px] h-[5.988px] left-[5.19px] rounded-[46422600px] top-[54px] w-[41.613px]" data-name="Container" />;
}

function Container88() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#1d7a56,0px_6px_8px_0px_rgba(42,166,118,0.35)] size-[51.989px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(76, 208, 128) 0%, rgb(42, 166, 118) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container89() {
  return <div className="absolute h-[18.18px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.796px]" data-name="Container" style={{ backgroundImage: "url(\'data:image/svg+xml;utf8,<svg viewBox=\\'0 0 20.796 18.18\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0 -1.7997 -2.0587 0 6.2387 5.454)\\'><stop stop-color=\\'rgba(255,255,255,0.45)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(191,191,191,0.3375)\\' offset=\\'0.175\\'/><stop stop-color=\\'rgba(128,128,128,0.225)\\' offset=\\'0.35\\'/><stop stop-color=\\'rgba(64,64,64,0.1125)\\' offset=\\'0.525\\'/><stop stop-color=\\'rgba(0,0,0,0)\\' offset=\\'0.7\\'/></radialGradient></defs></svg>\')" }} />;
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[25.984px]" data-name="Icon">
      <div className="absolute inset-[-7.39%_-11.24%_-10.91%_-7.07%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30.7413 30.7413">
          <g filter="url(#filter0_d_2275_2032)" id="Icon">
            <path d={svgPaths.p2b3d6a00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9839" id="filter0_d_2275_2032" width="33.9839" x="-2.1639" y="-1.07872">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2275_2032" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2275_2032" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container90() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.022px] size-[51.989px] top-0" data-name="Container">
      <Icon11 />
    </div>
  );
}

function Container86() {
  return (
    <div className="absolute h-[59.988px] left-[29.44px] top-[13.14px] w-[51.989px]" data-name="Container">
      <Container87 />
      <Container88 />
      <Container89 />
      <Container90 />
    </div>
  );
}

function Text11() {
  return (
    <div className="absolute h-[11.241px] left-[22.16px] overflow-clip top-[86.51px] w-[66.559px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[11.25px] left-[33.5px] not-italic text-[9px] text-[rgba(255,255,255,0.8)] text-center top-[0.23px]" dir="auto">
        شركات الصيانة
      </p>
    </div>
  );
}

function Button12() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.383px] border-[rgba(0,188,125,0.15)] border-solid left-[247.26px] overflow-clip rounded-[22px] size-[113.663px] top-0" data-name="Button">
      <Container84 />
      <Container85 />
      <Container86 />
      <Text11 />
    </div>
  );
}

function Container91() {
  return <div className="absolute left-0 size-[110.875px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgba(254, 154, 0, 0.06) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function Container92() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.994px] left-[8px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.1)] w-[94.878px]" data-name="Container" />;
}

function Container94() {
  return <div className="absolute bg-[rgba(240,180,32,0.35)] blur-[6px] h-[5.988px] left-[5.19px] rounded-[46422600px] top-[54px] w-[41.613px]" data-name="Container" />;
}

function Container95() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#c49018,0px_6px_8px_0px_rgba(240,180,32,0.35)] size-[51.989px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 213, 79) 0%, rgb(240, 180, 32) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container96() {
  return <div className="absolute h-[18.18px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.796px]" data-name="Container" style={{ backgroundImage: "url(\'data:image/svg+xml;utf8,<svg viewBox=\\'0 0 20.796 18.18\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0 -1.7997 -2.0587 0 6.2387 5.454)\\'><stop stop-color=\\'rgba(255,255,255,0.5)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(191,191,191,0.375)\\' offset=\\'0.175\\'/><stop stop-color=\\'rgba(128,128,128,0.25)\\' offset=\\'0.35\\'/><stop stop-color=\\'rgba(64,64,64,0.125)\\' offset=\\'0.525\\'/><stop stop-color=\\'rgba(0,0,0,0)\\' offset=\\'0.7\\'/></radialGradient></defs></svg>\')" }} />;
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[25.984px]" data-name="Icon">
      <div className="absolute inset-[0_-11.23%_-2.58%_-11.23%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.8186 26.6532">
          <g filter="url(#filter0_d_2275_1946)" id="Icon">
            <path d={svgPaths.p20a32e00} id="Vector" stroke="var(--stroke-0, #5D4037)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d={svgPaths.pf7dd300} id="Vector_2" stroke="var(--stroke-0, #5D4037)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d={svgPaths.p994e700} id="Vector_3" stroke="var(--stroke-0, #5D4037)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d={svgPaths.p3416fd80} id="Vector_4" stroke="var(--stroke-0, #5D4037)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9839" id="filter0_d_2275_1946" width="33.9839" x="-1.08266" y="-3">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2275_1946" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2275_1946" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container97() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.022px] size-[51.989px] top-0" data-name="Container">
      <Icon12 />
    </div>
  );
}

function Container93() {
  return (
    <div className="absolute h-[59.988px] left-[29.44px] top-[13.12px] w-[51.989px]" data-name="Container">
      <Container94 />
      <Container95 />
      <Container96 />
      <Container97 />
    </div>
  );
}

function Text12() {
  return (
    <div className="absolute h-[11.241px] left-[20.99px] overflow-clip top-[86.49px] w-[68.872px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[11.25px] left-[34.5px] not-italic text-[9px] text-[rgba(255,255,255,0.8)] text-center top-[0.23px]" dir="auto">
        العمالة الحرفية
      </p>
    </div>
  );
}

function Button13() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.383px] border-[rgba(254,154,0,0.15)] border-solid left-0 overflow-clip rounded-[22px] size-[113.642px] top-[123.65px]" data-name="Button">
      <Container91 />
      <Container92 />
      <Container93 />
      <Text12 />
    </div>
  );
}

function Container98() {
  return <div className="absolute left-0 size-[110.875px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgba(251, 44, 54, 0.06) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function Container99() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.994px] left-[8px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.1)] w-[94.878px]" data-name="Container" />;
}

function Container101() {
  return <div className="absolute bg-[rgba(224,69,69,0.35)] blur-[6px] h-[5.988px] left-[5.19px] rounded-[46422600px] top-[54px] w-[41.613px]" data-name="Container" />;
}

function Container102() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#b33030,0px_6px_8px_0px_rgba(224,69,69,0.35)] size-[51.989px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 107, 107) 0%, rgb(224, 69, 69) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container103() {
  return <div className="absolute h-[18.18px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.796px]" data-name="Container" style={{ backgroundImage: "url(\'data:image/svg+xml;utf8,<svg viewBox=\\'0 0 20.796 18.18\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0 -1.7997 -2.0587 0 6.2387 5.454)\\'><stop stop-color=\\'rgba(255,255,255,0.45)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(191,191,191,0.3375)\\' offset=\\'0.175\\'/><stop stop-color=\\'rgba(128,128,128,0.225)\\' offset=\\'0.35\\'/><stop stop-color=\\'rgba(64,64,64,0.1125)\\' offset=\\'0.525\\'/><stop stop-color=\\'rgba(0,0,0,0)\\' offset=\\'0.7\\'/></radialGradient></defs></svg>\')" }} />;
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[25.984px]" data-name="Icon">
      <div className="absolute inset-[-3.38%_-11.23%_-10.89%_-7.04%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30.7298 29.6904">
          <g filter="url(#filter0_d_2275_1965)" id="Icon">
            <path d={svgPaths.p3fb6e300} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d={svgPaths.p18de5200} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d={svgPaths.p21fdd730} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9839" id="filter0_d_2275_1965" width="33.9839" x="-2.17147" y="-2.12202">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2275_1965" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2275_1965" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container104() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.022px] size-[51.989px] top-0" data-name="Container">
      <Icon13 />
    </div>
  );
}

function Container100() {
  return (
    <div className="absolute h-[59.988px] left-[29.44px] top-[13.12px] w-[51.989px]" data-name="Container">
      <Container101 />
      <Container102 />
      <Container103 />
      <Container104 />
    </div>
  );
}

function Text13() {
  return (
    <div className="absolute h-[11.241px] left-[38.59px] overflow-clip top-[86.49px] w-[33.68px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[11.25px] left-[17px] not-italic text-[9px] text-[rgba(255,255,255,0.8)] text-center top-[0.23px]" dir="auto">
        الورش
      </p>
    </div>
  );
}

function Button14() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.383px] border-[rgba(251,44,54,0.15)] border-solid left-[123.63px] overflow-clip rounded-[22px] size-[113.642px] top-[123.65px]" data-name="Button">
      <Container98 />
      <Container99 />
      <Container100 />
      <Text13 />
    </div>
  );
}

function Container105() {
  return <div className="absolute left-0 size-[110.896px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgba(212, 175, 55, 0.06) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function Container106() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.994px] left-[8px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.1)] w-[94.9px]" data-name="Container" />;
}

function Container108() {
  return <div className="absolute bg-[rgba(212,175,55,0.35)] blur-[6px] h-[5.988px] left-[5.19px] rounded-[46422600px] top-[54px] w-[41.613px]" data-name="Container" />;
}

function Container109() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#a88a20,0px_6px_8px_0px_rgba(212,175,55,0.35)] size-[51.989px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 215, 0) 0%, rgb(212, 175, 55) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container110() {
  return <div className="absolute h-[18.18px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.796px]" data-name="Container" style={{ backgroundImage: "url(\'data:image/svg+xml;utf8,<svg viewBox=\\'0 0 20.796 18.18\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0 -1.7997 -2.0587 0 6.2387 5.454)\\'><stop stop-color=\\'rgba(255,255,255,0.55)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(191,191,191,0.4125)\\' offset=\\'0.175\\'/><stop stop-color=\\'rgba(128,128,128,0.275)\\' offset=\\'0.35\\'/><stop stop-color=\\'rgba(64,64,64,0.1375)\\' offset=\\'0.525\\'/><stop stop-color=\\'rgba(0,0,0,0)\\' offset=\\'0.7\\'/></radialGradient></defs></svg>\')" }} />;
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[25.984px]" data-name="Icon">
      <div className="absolute inset-[0_-11.23%_-6.74%_-11.23%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.8186 27.7359">
          <g filter="url(#filter0_d_2275_2073)" id="Icon">
            <path d={svgPaths.pedae880} id="Vector" stroke="var(--stroke-0, #5D4037)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d="M19.1573 19.4879H12.6613" id="Vector_2" stroke="var(--stroke-0, #5D4037)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d={svgPaths.p721c700} id="Vector_3" stroke="var(--stroke-0, #5D4037)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d={svgPaths.p32805f80} id="Vector_4" stroke="var(--stroke-0, #5D4037)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d={svgPaths.pbae98f0} id="Vector_5" stroke="var(--stroke-0, #5D4037)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9839" id="filter0_d_2275_2073" width="33.9839" x="-1.08266" y="-3">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2275_2073" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2275_2073" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container111() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.022px] size-[51.989px] top-0" data-name="Container">
      <Icon14 />
    </div>
  );
}

function Container107() {
  return (
    <div className="absolute h-[59.988px] left-[29.44px] top-[13.14px] w-[51.989px]" data-name="Container">
      <Container108 />
      <Container109 />
      <Container110 />
      <Container111 />
    </div>
  );
}

function Text14() {
  return (
    <div className="absolute h-[11.241px] left-[24.82px] overflow-clip top-[86.51px] w-[61.242px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[11.25px] left-[31px] not-italic text-[9px] text-[rgba(255,255,255,0.8)] text-center top-[0.23px]" dir="auto">
        تأجير المعدات
      </p>
    </div>
  );
}

function Button15() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.383px] border-[rgba(212,175,55,0.15)] border-solid left-[247.26px] overflow-clip rounded-[22px] size-[113.663px] top-[123.65px]" data-name="Button">
      <Container105 />
      <Container106 />
      <Container107 />
      <Text14 />
    </div>
  );
}

function Container112() {
  return <div className="absolute left-0 size-[110.875px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgba(187, 77, 0, 0.06) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function Container113() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.994px] left-[8px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.1)] w-[94.878px]" data-name="Container" />;
}

function Container115() {
  return <div className="absolute bg-[rgba(141,110,99,0.35)] blur-[6px] h-[5.988px] left-[5.19px] rounded-[46422600px] top-[54px] w-[41.613px]" data-name="Container" />;
}

function Container116() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#6d4c41,0px_6px_8px_0px_rgba(141,110,99,0.35)] size-[51.989px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(161, 136, 127) 0%, rgb(141, 110, 99) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container117() {
  return <div className="absolute h-[18.18px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.796px]" data-name="Container" style={{ backgroundImage: "url(\'data:image/svg+xml;utf8,<svg viewBox=\\'0 0 20.796 18.18\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0 -1.7997 -2.0587 0 6.2387 5.454)\\'><stop stop-color=\\'rgba(255,255,255,0.4)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(191,191,191,0.3)\\' offset=\\'0.175\\'/><stop stop-color=\\'rgba(128,128,128,0.2)\\' offset=\\'0.35\\'/><stop stop-color=\\'rgba(64,64,64,0.1)\\' offset=\\'0.525\\'/><stop stop-color=\\'rgba(0,0,0,0)\\' offset=\\'0.7\\'/></radialGradient></defs></svg>\')" }} />;
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[25.984px]" data-name="Icon">
      <div className="absolute inset-[-7.37%_-7.06%_-15.08%_-7.06%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29.6532 31.8164">
          <g filter="url(#filter0_d_2275_1959)" id="Icon">
            <path d={svgPaths.p107ca080} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d="M14.8266 25.7337V14.9071" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d={svgPaths.p300b5500} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d={svgPaths.p54e0680} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9839" id="filter0_d_2275_1959" width="33.9839" x="-2.16532" y="-1.08488">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2275_1959" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2275_1959" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container118() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.022px] size-[51.989px] top-0" data-name="Container">
      <Icon15 />
    </div>
  );
}

function Container114() {
  return (
    <div className="absolute h-[59.988px] left-[29.44px] top-[13.12px] w-[51.989px]" data-name="Container">
      <Container115 />
      <Container116 />
      <Container117 />
      <Container118 />
    </div>
  );
}

function Text15() {
  return (
    <div className="absolute h-[11.241px] left-[17.23px] overflow-clip top-[86.49px] w-[76.395px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[11.25px] left-[38.5px] not-italic text-[9px] text-[rgba(255,255,255,0.8)] text-center top-[0.23px]" dir="auto">
        محلات مواد البناء
      </p>
    </div>
  );
}

function Button16() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.383px] border-[rgba(187,77,0,0.15)] border-solid left-0 overflow-clip rounded-[22px] size-[113.642px] top-[247.3px]" data-name="Button">
      <Container112 />
      <Container113 />
      <Container114 />
      <Text15 />
    </div>
  );
}

function Container119() {
  return <div className="absolute left-0 size-[110.875px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgba(173, 70, 255, 0.06) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function Container120() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.994px] left-[8px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.1)] w-[94.878px]" data-name="Container" />;
}

function Container122() {
  return <div className="absolute bg-[rgba(124,90,218,0.35)] blur-[6px] h-[5.988px] left-[5.19px] rounded-[46422600px] top-[54px] w-[41.613px]" data-name="Container" />;
}

function Container123() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#5a3db5,0px_6px_8px_0px_rgba(124,90,218,0.35)] size-[51.989px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(155, 122, 237) 0%, rgb(124, 90, 218) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container124() {
  return <div className="absolute h-[18.18px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.796px]" data-name="Container" style={{ backgroundImage: "url(\'data:image/svg+xml;utf8,<svg viewBox=\\'0 0 20.796 18.18\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0 -1.7997 -2.0587 0 6.2387 5.454)\\'><stop stop-color=\\'rgba(255,255,255,0.45)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(191,191,191,0.3375)\\' offset=\\'0.175\\'/><stop stop-color=\\'rgba(128,128,128,0.225)\\' offset=\\'0.35\\'/><stop stop-color=\\'rgba(64,64,64,0.1125)\\' offset=\\'0.525\\'/><stop stop-color=\\'rgba(0,0,0,0)\\' offset=\\'0.7\\'/></radialGradient></defs></svg>\')" }} />;
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[25.984px]" data-name="Icon">
      <div className="absolute inset-[0_-11.23%_-6.74%_-11.23%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.8186 27.7359">
          <g filter="url(#filter0_d_2275_1952)" id="Icon">
            <path d={svgPaths.p13630740} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d={svgPaths.p2b408ec0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d="M7.24799 19.4879V21.6532" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d="M24.5706 19.4879V21.6532" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d="M15.9093 4.33065V14.0746" id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9839" id="filter0_d_2275_1952" width="33.9839" x="-1.08266" y="-3">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2275_1952" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2275_1952" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container125() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.022px] size-[51.989px] top-0" data-name="Container">
      <Icon16 />
    </div>
  );
}

function Container121() {
  return (
    <div className="absolute h-[59.988px] left-[29.44px] top-[13.12px] w-[51.989px]" data-name="Container">
      <Container122 />
      <Container123 />
      <Container124 />
      <Container125 />
    </div>
  );
}

function Text16() {
  return (
    <div className="absolute h-[11.241px] left-[8.28px] overflow-clip top-[86.49px] w-[94.294px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[11.25px] left-[47.5px] not-italic text-[9px] text-[rgba(255,255,255,0.8)] text-center top-[0.23px]" dir="auto">
        محلات الأثاث والديكور
      </p>
    </div>
  );
}

function Button17() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.383px] border-[rgba(173,70,255,0.15)] border-solid left-[123.63px] overflow-clip rounded-[22px] size-[113.642px] top-[247.3px]" data-name="Button">
      <Container119 />
      <Container120 />
      <Container121 />
      <Text16 />
    </div>
  );
}

function Container126() {
  return <div className="absolute left-0 size-[110.896px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgba(0, 184, 219, 0.06) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function Container127() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.994px] left-[8px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.1)] w-[94.9px]" data-name="Container" />;
}

function Container129() {
  return <div className="absolute bg-[rgba(38,198,218,0.35)] blur-[6px] h-[5.988px] left-[5.19px] rounded-[46422600px] top-[54px] w-[41.613px]" data-name="Container" />;
}

function Container130() {
  return (
    <div className="absolute left-0 rounded-[14px] shadow-[0px_4px_0px_0px_#1a9aad,0px_6px_8px_0px_rgba(38,198,218,0.35)] size-[51.989px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(77, 208, 225) 0%, rgb(38, 198, 218) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container131() {
  return <div className="absolute h-[18.18px] left-[4px] rounded-bl-[7px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[7px] top-[4px] w-[20.796px]" data-name="Container" style={{ backgroundImage: "url(\'data:image/svg+xml;utf8,<svg viewBox=\\'0 0 20.796 18.18\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0 -1.7997 -2.0587 0 6.2387 5.454)\\'><stop stop-color=\\'rgba(255,255,255,0.5)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(191,191,191,0.375)\\' offset=\\'0.175\\'/><stop stop-color=\\'rgba(128,128,128,0.25)\\' offset=\\'0.35\\'/><stop stop-color=\\'rgba(64,64,64,0.125)\\' offset=\\'0.525\\'/><stop stop-color=\\'rgba(0,0,0,0)\\' offset=\\'0.7\\'/></radialGradient></defs></svg>\')" }} />;
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[25.984px]" data-name="Icon">
      <div className="absolute inset-[-7.38%_-11.24%_-15.08%_-11.22%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.8191 31.8191">
          <g filter="url(#filter0_d_2275_2009)" id="Icon">
            <path d={svgPaths.pa6301a0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d="M24.5689 5.16559V9.49624" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d="M26.7343 7.33092H22.4036" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d="M7.24634 20.3229V22.4882" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
            <path d="M8.329 21.4055H6.16367" id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="33.9839" id="filter0_d_2275_2009" width="33.9839" x="-1.08431" y="-1.08239">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2275_2009" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2275_2009" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container132() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.022px] size-[51.989px] top-0" data-name="Container">
      <Icon17 />
    </div>
  );
}

function Container128() {
  return (
    <div className="absolute h-[59.988px] left-[29.44px] top-[13.14px] w-[51.989px]" data-name="Container">
      <Container129 />
      <Container130 />
      <Container131 />
      <Container132 />
    </div>
  );
}

function Text17() {
  return (
    <div className="absolute h-[11.241px] left-[22.01px] overflow-clip top-[86.51px] w-[66.862px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[11.25px] left-[33.5px] not-italic text-[9px] text-[rgba(255,255,255,0.8)] text-center top-[0.23px]" dir="auto">
        خدمات النظافة
      </p>
    </div>
  );
}

function Button18() {
  return (
    <div className="absolute bg-[rgba(17,21,24,0.85)] border-[1.383px] border-[rgba(0,184,219,0.15)] border-solid left-[247.26px] overflow-clip rounded-[22px] size-[113.663px] top-[247.3px]" data-name="Button">
      <Container126 />
      <Container127 />
      <Container128 />
      <Text17 />
    </div>
  );
}

function Container69() {
  return (
    <div className="h-[360.964px] relative shrink-0 w-full" data-name="Container">
      <Button10 />
      <Button11 />
      <Button12 />
      <Button13 />
      <Button14 />
      <Button15 />
      <Button16 />
      <Button17 />
      <Button18 />
    </div>
  );
}

function Container67() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[11.998px] h-[392.958px] items-start left-0 top-[509.99px] w-[360.921px]" data-name="Container">
      <Container68 />
      <Container69 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[19.996px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="-translate-x-full absolute font-['Cairo:Bold',sans-serif] font-bold leading-[20px] left-[214.48px] not-italic text-[14px] text-right text-white top-[-1.15px]" dir="auto">
        مساعد وياك الذكي
      </p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[15.002px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-full absolute font-['Cairo:Regular',sans-serif] font-normal leading-[15px] left-[214.25px] not-italic text-[#99a1af] text-[10px] text-right top-[-0.77px]" dir="auto">
        تحب أساعدك في إيه؟
      </p>
    </div>
  );
}

function Container133() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[1.989px] h-[36.987px] items-start left-[47.99px] top-[33.98px] w-[214.183px]" data-name="Container">
      <Heading3 />
      <Paragraph1 />
    </div>
  );
}

function Icon18() {
  return (
    <div className="absolute left-[16px] size-[15.997px] top-[44.49px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9967 15.9967">
        <g id="Icon">
          <path d={svgPaths.p1d487240} id="Vector" stroke="var(--stroke-0, #2AA676)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33306" />
          <path d={svgPaths.p28cd6900} id="Vector_2" stroke="var(--stroke-0, #2AA676)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33306" />
        </g>
      </svg>
    </div>
  );
}

function Container135() {
  return <div className="absolute bg-[rgba(67,160,71,0.35)] blur-[7px] h-[6.982px] left-[6.4px] rounded-[46422600px] top-[66px] w-[51.19px]" data-name="Container" />;
}

function Container136() {
  return (
    <div className="absolute left-0 rounded-[18px] shadow-[0px_5px_0px_0px_#2e7d32,0px_7px_9px_0px_rgba(67,160,71,0.35)] size-[63.987px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 187, 106) 0%, rgb(67, 160, 71) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.15),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

function Container137() {
  return <div className="absolute h-[22.395px] left-[4px] rounded-bl-[9px] rounded-br-[18px] rounded-tl-[18px] rounded-tr-[9px] top-[4px] w-[25.595px]" data-name="Container" style={{ backgroundImage: "url(\'data:image/svg+xml;utf8,<svg viewBox=\\'0 0 25.595 22.395\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0 -2.217 -2.5338 0 7.6784 6.7186)\\'><stop stop-color=\\'rgba(255,255,255,0.45)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(191,191,191,0.3375)\\' offset=\\'0.175\\'/><stop stop-color=\\'rgba(128,128,128,0.225)\\' offset=\\'0.35\\'/><stop stop-color=\\'rgba(64,64,64,0.1125)\\' offset=\\'0.525\\'/><stop stop-color=\\'rgba(0,0,0,0)\\' offset=\\'0.7\\'/></radialGradient></defs></svg>\')" }} />;
}

function Icon19() {
  return (
    <div className="relative shrink-0 size-[31.993px]" data-name="Icon">
      <div className="absolute inset-[0_-8.34%_-3.13%_-8.34%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 37.3274 32.9943">
          <g filter="url(#filter0_d_2275_2035)" id="Icon">
            <path d={svgPaths.p39167180} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66612" />
            <path d={svgPaths.p2e93ed40} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66612" />
            <path d="M5.33306 18.6629H7.99919" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66612" />
            <path d="M29.3282 18.6629H31.9943" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66612" />
            <path d="M22.6629 17.3298V19.9959" id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66612" />
            <path d="M14.6645 17.3298V19.9959" id="Vector_6" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66612" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="39.9935" id="filter0_d_2275_2035" width="39.9935" x="-1.33306" y="-3">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2275_2035" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2275_2035" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container138() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[63.987px] top-0" data-name="Container">
      <Icon19 />
    </div>
  );
}

function Container134() {
  return (
    <div className="absolute h-[72.98px] left-[278.17px] top-[16px] w-[63.987px]" data-name="Container">
      <Container135 />
      <Container136 />
      <Container137 />
      <Container138 />
    </div>
  );
}

function Button19() {
  return (
    <div className="absolute bg-gradient-to-l border-[1.383px] border-[rgba(42,166,118,0.2)] border-solid from-[rgba(42,166,118,0.2)] h-[107.74px] left-0 rounded-[16px] to-[rgba(28,32,38,0.8)] top-[922.95px] w-[360.921px]" data-name="Button">
      <Container133 />
      <Icon18 />
      <Container134 />
    </div>
  );
}

function Text18() {
  return (
    <div className="bg-[rgba(42,166,118,0.1)] h-[18.98px] relative rounded-[46422600px] shrink-0 w-[21.552px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Cairo:Bold',sans-serif] font-bold leading-[15px] left-[8px] not-italic text-[#2aa676] text-[10px] top-[1.22px]">2</p>
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[19.996px] relative shrink-0 w-[106.054px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Cairo:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[14px] text-white top-[-1.15px]" dir="auto">
          المشاريع النشطة
        </p>
      </div>
    </div>
  );
}

function Container140() {
  return (
    <div className="content-stretch flex h-[19.996px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text18 />
      <Heading4 />
    </div>
  );
}

function Text19() {
  return (
    <div className="h-[15.002px] relative shrink-0 w-[17.121px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Cairo:Bold',sans-serif] font-bold leading-[15px] left-0 not-italic text-[#2aa676] text-[10px] top-[-0.77px]">72%</p>
      </div>
    </div>
  );
}

function Text20() {
  return (
    <div className="h-[15.997px] relative shrink-0 w-[112.28px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Cairo:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#d1d5dc] text-[12px] top-[-1.15px]" dir="auto">
          فيلا نجد - حي الياسمين
        </p>
      </div>
    </div>
  );
}

function Container142() {
  return (
    <div className="content-stretch flex h-[15.997px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text19 />
      <Text20 />
    </div>
  );
}

function Container144() {
  return <div className="bg-[#2aa676] h-[5.988px] rounded-[46422600px] shrink-0 w-[234.828px]" data-name="Container" />;
}

function Container143() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] content-stretch flex h-[5.988px] items-start justify-end overflow-clip relative rounded-[46422600px] shrink-0 w-full" data-name="Container">
      <Container144 />
    </div>
  );
}

function Container141() {
  return (
    <div className="content-stretch flex flex-col gap-[7.998px] h-[29.983px] items-start relative shrink-0 w-full" data-name="Container">
      <Container142 />
      <Container143 />
    </div>
  );
}

function Container139() {
  return (
    <div className="absolute bg-[rgba(28,32,38,0.8)] content-stretch flex flex-col gap-[11.997px] h-[96.737px] items-start left-0 pb-[1.383px] pt-[17.38px] px-[17.38px] rounded-[16px] top-[1050.68px] w-[360.921px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1.383px] border-[rgba(42,166,118,0.1)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Container140 />
      <Container141 />
    </div>
  );
}

function TextInput() {
  return (
    <div className="absolute bg-[rgba(28,32,38,0.8)] h-[46.736px] left-0 rounded-[16px] top-0 w-[360.921px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip pl-[16px] pr-[48px] py-[12px] relative rounded-[inherit] size-full">
        <p className="font-['Cairo:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6a7282] text-[14px] text-right" dir="auto">
          ابحث عن خدمة، منتج، أو مزود...
        </p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.383px] border-[rgba(42,166,118,0.1)] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function Icon20() {
  return (
    <div className="absolute left-[326.94px] size-[17.986px] top-[13.99px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.9855 17.9855">
        <g id="Icon">
          <path d={svgPaths.p814b800} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49879" />
          <path d={svgPaths.p150cb580} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49879" />
        </g>
      </svg>
    </div>
  );
}

function Container145() {
  return (
    <div className="absolute h-[46.736px] left-0 top-[87.98px] w-[360.921px]" data-name="Container">
      <TextInput />
      <Icon20 />
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[1147.42px] relative shrink-0 w-full" data-name="Container">
      <Container4 />
      <Container20 />
      <Container21 />
      <Container67 />
      <Button19 />
      <Container139 />
      <Container145 />
    </div>
  );
}

function MainContent() {
  return (
    <div className="absolute content-stretch flex flex-col h-[765.012px] items-start left-0 overflow-clip pt-[87.982px] px-[15.997px] top-[87.23px] w-[392.915px]" data-name="Main Content">
      <Container3 />
    </div>
  );
}

function Container146() {
  return <div className="absolute bg-[rgba(10,13,15,0.85)] h-[87.225px] left-0 top-0 w-[392.915px]" data-name="Container" />;
}

function Container147() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.994px] left-0 to-[rgba(0,0,0,0)] top-[86.23px] via-1/2 via-[rgba(255,255,255,0.08)] w-[392.915px]" data-name="Container" />;
}

function Container148() {
  return <div className="absolute bg-[rgba(42,166,118,0.05)] blur-[64px] h-[79.984px] left-[232.93px] rounded-[46422600px] top-0 w-[159.989px]" data-name="Container" />;
}

function Button20() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] border-[1.383px] border-[rgba(255,255,255,0.08)] border-solid h-[33.766px] left-[47.99px] rounded-[46422600px] top-[3.11px] w-[58.345px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[15px] left-[28px] not-italic text-[#d1d5dc] text-[10px] text-center top-[7.23px]">English</p>
    </div>
  );
}

function Icon21() {
  return (
    <div className="absolute left-[9.62px] size-[17.986px] top-[9.62px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.9855 17.9855">
        <g clipPath="url(#clip0_2275_2028)" id="Icon">
          <path d={svgPaths.p1487e80} id="Vector" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49879" />
          <path d={svgPaths.p200a0f50} id="Vector_2" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49879" />
        </g>
        <defs>
          <clipPath id="clip0_2275_2028">
            <rect fill="white" height="17.9855" width="17.9855" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text22() {
  return <div className="absolute bg-[#fb2c36] border-[#0a0d0f] border-[1.383px] border-solid left-0 rounded-[46422600px] shadow-[0px_10px_15px_0px_rgba(251,44,54,0.3),0px_4px_6px_0px_rgba(251,44,54,0.3)] size-[9.987px] top-0" data-name="Text" />;
}

function Text21() {
  return (
    <div className="absolute left-[21.25px] size-[9.987px] top-[5.99px]" data-name="Text">
      <Text22 />
    </div>
  );
}

function Button21() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] border-[1.383px] border-[rgba(255,255,255,0.08)] border-solid left-0 rounded-[46422600px] size-[39.992px] top-0" data-name="Button">
      <Icon21 />
      <Text21 />
    </div>
  );
}

function Container150() {
  return (
    <div className="h-[39.992px] relative shrink-0 w-[106.335px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Button20 />
        <Button21 />
      </div>
    </div>
  );
}

function Heading5() {
  return (
    <div className="h-[17.51px] relative shrink-0 w-[78.276px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Cairo:Bold',sans-serif] font-bold leading-[17.5px] left-0 not-italic text-[14px] text-white top-[-1.53px] tracking-[-0.35px]" dir="auto">
          أحمد الفارس
        </p>
      </div>
    </div>
  );
}

function Icon22() {
  return (
    <div className="absolute left-0 size-[9.987px] top-[6.87px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.98716 9.98716">
        <g id="Icon">
          <path d={svgPaths.pb056e90} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.832263" />
        </g>
      </svg>
    </div>
  );
}

function Text24() {
  return <div className="absolute bg-gradient-to-r from-[rgba(42,166,118,0.1)] h-[20.969px] left-0 to-[rgba(0,0,0,0)] top-0 w-[44.229px]" data-name="Text" />;
}

function Text23() {
  return (
    <div className="absolute bg-[rgba(42,166,118,0.15)] border-[1.383px] border-[rgba(42,166,118,0.2)] border-solid h-[23.736px] left-[15.98px] overflow-clip rounded-[46422600px] top-0 w-[46.996px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[15px] left-[22.49px] not-italic text-[#2aa676] text-[10px] text-center top-[2.22px]" dir="auto">
        عميل
      </p>
      <Text24 />
    </div>
  );
}

function Button22() {
  return (
    <div className="h-[23.736px] relative shrink-0 w-[62.971px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon22 />
        <Text23 />
      </div>
    </div>
  );
}

function Container152() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.999px] h-[45.245px] items-end left-0 top-0 w-[78.276px]" data-name="Container">
      <Heading5 />
      <Button22 />
    </div>
  );
}

function ImageUser() {
  return (
    <div className="h-[37.246px] relative shrink-0 w-full" data-name="Image (User)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageUser} />
    </div>
  );
}

function Container155() {
  return (
    <div className="h-[40.013px] relative rounded-[46422600px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pb-[1.383px] pl-[1.384px] pr-[1.383px] pt-[1.384px] relative size-full">
          <ImageUser />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#0a0d0f] border-[1.383px] border-solid inset-0 pointer-events-none rounded-[46422600px]" />
    </div>
  );
}

function Container154() {
  return (
    <div className="absolute bg-gradient-to-b content-stretch flex flex-col from-[#d4af37] items-start left-0 pt-[1.989px] px-[1.989px] rounded-[46422600px] size-[43.991px] to-[#d4af37] top-0 via-1/2 via-[#2aa676]" data-name="Container">
      <Container155 />
    </div>
  );
}

function Icon23() {
  return (
    <div className="relative shrink-0 size-[9.987px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.98716 9.98716">
        <g id="Icon">
          <path d={svgPaths.p1a151c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24839" />
        </g>
      </svg>
    </div>
  );
}

function Container156() {
  return (
    <div className="absolute bg-[#2aa676] content-stretch flex items-center justify-center left-[-1.99px] pl-[1.383px] pr-[1.405px] py-[1.383px] rounded-[46422600px] size-[19.996px] top-[25.98px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#0a0d0f] border-[1.383px] border-solid inset-0 pointer-events-none rounded-[46422600px] shadow-[0px_10px_15px_0px_rgba(42,166,118,0.3),0px_4px_6px_0px_rgba(42,166,118,0.3)]" />
      <Icon23 />
    </div>
  );
}

function Container157() {
  return <div className="absolute bg-[#00d492] border-[#0a0d0f] border-[1.383px] border-solid left-[31.99px] rounded-[46422600px] shadow-[0px_10px_15px_0px_rgba(0,212,146,0.4),0px_4px_6px_0px_rgba(0,212,146,0.4)] size-[11.998px] top-0" data-name="Container" />;
}

function Container153() {
  return (
    <div className="absolute left-[90.27px] size-[43.991px] top-[0.63px]" data-name="Container">
      <Container154 />
      <Container156 />
      <Container157 />
    </div>
  );
}

function Container151() {
  return (
    <div className="h-[45.245px] relative shrink-0 w-[134.265px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container152 />
        <Container153 />
      </div>
    </div>
  );
}

function Container149() {
  return (
    <div className="absolute content-stretch flex h-[87.225px] items-center justify-between left-0 px-[15.997px] top-0 w-[392.915px]" data-name="Container">
      <Container150 />
      <Container151 />
    </div>
  );
}

function Header() {
  return (
    <div className="absolute h-[87.225px] left-0 top-0 w-[392.915px]" data-name="Header">
      <Container146 />
      <Container147 />
      <Container148 />
      <Container149 />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute bg-[#111318] h-[852.237px] left-0 overflow-clip shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] top-0 w-[392.915px]" data-name="Container">
      <Container1 />
      <Container2 />
      <MainContent />
      <Header />
    </div>
  );
}

function PQ() {
  return (
    <div className="absolute bg-black h-[852.237px] left-0 top-0 w-[392.915px]" data-name="pQ">
      <Container />
    </div>
  );
}

function Container158() {
  return <div className="absolute bg-[rgba(10,13,15,0.92)] border-[rgba(255,255,255,0.08)] border-solid border-t-[1.383px] h-[102.984px] left-0 rounded-tl-[28px] rounded-tr-[28px] top-0 w-[392.915px]" data-name="Container" />;
}

function Container159() {
  return <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0)] h-[0.994px] left-0 rounded-tl-[28px] rounded-tr-[28px] to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(255,255,255,0.1)] w-[392.915px]" data-name="Container" />;
}

function Container160() {
  return <div className="absolute bg-gradient-to-t from-[rgba(42,166,118,0.03)] h-[63.987px] left-0 rounded-tl-[28px] rounded-tr-[28px] to-[rgba(0,0,0,0)] top-[39px] w-[392.915px]" data-name="Container" />;
}

function Icon24() {
  return (
    <div className="h-[21.985px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[45.83%]" data-name="Vector">
        <div className="absolute inset-[-45%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.48091 3.48091">
            <path d={svgPaths.p1dfe7900} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.64885" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[45.83%] left-3/4 right-[16.67%] top-[45.83%]" data-name="Vector">
        <div className="absolute inset-[-45%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.48091 3.48091">
            <path d={svgPaths.p1dfe7900} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.64885" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[45.83%] left-[16.67%] right-3/4 top-[45.83%]" data-name="Vector">
        <div className="absolute inset-[-45%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.48091 3.48091">
            <path d={svgPaths.p1dfe7900} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.64885" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container162() {
  return (
    <div className="relative rounded-[14px] shrink-0 size-[37.981px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[7.998px] px-[7.998px] relative size-full">
        <Icon24 />
      </div>
    </div>
  );
}

function Text25() {
  return (
    <div className="h-[15.002px] relative shrink-0 w-[24.363px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Cairo:Medium',sans-serif] font-medium leading-[15px] left-[12.5px] not-italic text-[#4a5565] text-[10px] text-center top-[-0.77px]" dir="auto">
          المزيد
        </p>
      </div>
    </div>
  );
}

function Button23() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[1.989px] h-[70.969px] items-center justify-center left-[8px] top-[20.02px] w-[78.73px]" data-name="Button">
      <Container162 />
      <Text25 />
    </div>
  );
}

function Icon25() {
  return (
    <div className="h-[21.985px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-4.5%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.1374 19.9694">
            <path d={svgPaths.p28039770} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.64885" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[12.5%] right-[12.5%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-0.82px_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.1374 1.64885">
            <path d="M0.824427 0.824427H17.313" id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.64885" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[41.67%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-22.5%_-11.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.97709 5.31297">
            <path d={svgPaths.p92dc700} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.64885" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container163() {
  return (
    <div className="relative rounded-[14px] shrink-0 size-[37.981px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[7.998px] px-[7.998px] relative size-full">
        <Icon25 />
      </div>
    </div>
  );
}

function Text26() {
  return (
    <div className="h-[15.002px] relative shrink-0 w-[24.579px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Cairo:Medium',sans-serif] font-medium leading-[15px] left-[12.5px] not-italic text-[#4a5565] text-[10px] text-center top-[-0.77px]" dir="auto">
          المتجر
        </p>
      </div>
    </div>
  );
}

function Button24() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[1.989px] h-[70.969px] items-center justify-center left-[86.73px] top-[20.02px] w-[78.73px]" data-name="Button">
      <Container163 />
      <Text26 />
    </div>
  );
}

function Text27() {
  return (
    <div className="absolute h-[15.002px] left-[20.34px] top-[67.99px] w-[21.293px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:Bold',sans-serif] font-bold leading-[15px] left-[11px] not-italic text-[#6a7282] text-[10px] text-center top-[-0.77px]" dir="auto">
        وياك
      </p>
    </div>
  );
}

function Container164() {
  return <div className="absolute left-[-4.99px] rounded-[46422600px] size-[71.985px] top-[5.49px]" data-name="Container" />;
}

function Container166() {
  return <div className="absolute bg-gradient-to-b from-[rgba(255,255,255,0.2)] h-[19.996px] left-[12px] rounded-[46422600px] to-[rgba(0,0,0,0)] top-[4px] w-[35.236px]" data-name="Container" />;
}

function Container167() {
  return <div className="absolute border-[#0a0d0f] border-[2.767px] border-solid left-0 rounded-[46422600px] size-[59.231px] top-0" data-name="Container" />;
}

function Icon26() {
  return (
    <div className="absolute left-[16.62px] size-[25.984px] top-[16.62px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25.9839 25.9839">
        <g id="Icon">
          <path d={svgPaths.p167e0f80} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
          <path d={svgPaths.p30e55200} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
          <path d="M2.16533 15.1573H4.33065" id="Vector_3" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
          <path d="M21.6532 15.1573H23.8186" id="Vector_4" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
          <path d="M16.2399 14.0746V16.2399" id="Vector_5" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
          <path d="M9.74396 14.0746V16.2399" id="Vector_6" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.16532" />
        </g>
      </svg>
    </div>
  );
}

function Container165() {
  return (
    <div className="absolute bg-[#1a1d21] border-[1.383px] border-[rgba(255,255,255,0.1)] border-solid left-0 rounded-[46422600px] size-[61.998px] top-0" data-name="Container">
      <Container166 />
      <Container167 />
      <Icon26 />
    </div>
  );
}

function Button25() {
  return (
    <div className="absolute h-[82.989px] left-[165.46px] top-[-20px] w-[61.998px]" data-name="Button">
      <Text27 />
      <Container164 />
      <Container165 />
    </div>
  );
}

function Icon27() {
  return (
    <div className="h-[21.985px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.32%_8.32%_12.49%_12.49%]" data-name="Vector">
        <div className="absolute inset-[-4.74%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.058 19.058">
            <path d={svgPaths.p2440d400} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.64885" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container168() {
  return (
    <div className="relative rounded-[14px] shrink-0 size-[37.981px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[7.998px] px-[7.998px] relative size-full">
        <Icon27 />
      </div>
    </div>
  );
}

function Text28() {
  return (
    <div className="h-[15.002px] relative shrink-0 w-[34.393px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Cairo:Medium',sans-serif] font-medium leading-[15px] left-[17.5px] not-italic text-[#4a5565] text-[10px] text-center top-[-0.77px]" dir="auto">
          الخدمات
        </p>
      </div>
    </div>
  );
}

function Button26() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[1.989px] h-[70.969px] items-center justify-center left-[227.46px] top-[20.02px] w-[78.73px]" data-name="Button">
      <Container168 />
      <Text28 />
    </div>
  );
}

function Icon28() {
  return (
    <div className="h-[21.985px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[12.5%] left-[37.5%] right-[37.5%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-13.89%_-20.83%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.78625 10.5343">
            <path d={svgPaths.p1ead7760} id="Vector" stroke="var(--stroke-0, #2AA676)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29007" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.34%_12.5%_12.5%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-6.58%_-6.94%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.7786 19.6942">
            <path d={svgPaths.p301dbb00} id="Vector" stroke="var(--stroke-0, #2AA676)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.29007" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container169() {
  return (
    <div className="absolute bg-[rgba(42,166,118,0.12)] content-stretch flex flex-col items-start left-[20.36px] pt-[7.998px] px-[7.998px] rounded-[14px] size-[37.981px] top-[8px]" data-name="Container">
      <Icon28 />
    </div>
  );
}

function Text29() {
  return (
    <div className="absolute h-[15.002px] left-[23.3px] top-[47.97px] w-[32.123px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Cairo:Medium',sans-serif] font-medium leading-[15px] left-[16.5px] not-italic text-[#2aa676] text-[10px] text-center top-[-0.77px]" dir="auto">
        الرئيسية
      </p>
    </div>
  );
}

function Container170() {
  return <div className="absolute bg-[#2aa676] h-[3.999px] left-[29.36px] rounded-[46422600px] shadow-[0px_10px_15px_0px_rgba(42,166,118,0.4),0px_4px_6px_0px_rgba(42,166,118,0.4)] top-[-1.99px] w-[19.996px]" data-name="Container" />;
}

function Button27() {
  return (
    <div className="absolute h-[70.969px] left-[306.19px] top-[20.02px] w-[78.73px]" data-name="Button">
      <Container169 />
      <Text29 />
      <Container170 />
    </div>
  );
}

function Container161() {
  return (
    <div className="absolute h-[102.984px] left-0 top-0 w-[392.915px]" data-name="Container">
      <Button23 />
      <Button24 />
      <Button25 />
      <Button26 />
      <Button27 />
    </div>
  );
}

function Navigation() {
  return (
    <div className="absolute h-[102.984px] left-0 top-[749.25px] w-[392.915px]" data-name="Navigation">
      <Container158 />
      <Container159 />
      <Container160 />
      <Container161 />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-white relative size-full" data-name="بيت الريف منصة البناء">
      <PQ />
      <Navigation />
    </div>
  );
}