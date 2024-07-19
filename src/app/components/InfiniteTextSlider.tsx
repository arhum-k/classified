import React, { useEffect, useRef } from 'react';

const InfiniteTextSlider: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const statements = [
    "Library too full?",
    "Impromptu Club Meeting?",
    "Want a chalkboard?",
    "Need a Projector?",
  ];

  // Create an array with the first element repeated at the end for smooth transition
  const extendedStatements = [...statements, statements[0]];

  const pauseLength = 4000; // Adjust this value to change the pause length (in milliseconds)

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const totalWidth = slider.scrollWidth;
    //const slideWidth = totalWidth / extendedStatements.length;
    const slideWidth = slider.offsetWidth; // Get the width of the container

    let currentIndex = 0;

    const animateSlider = () => {
      currentIndex += 1;
      if (currentIndex >= extendedStatements.length) {
        slider.style.transition = 'none';
        slider.style.transform = 'translateX(0)';
        currentIndex = 1; // Move to the second element after the reset
        setTimeout(() => {
          slider.style.transition = 'transform 1s ease-in-out';
          slider.style.transform = `translateX(-${slideWidth}px)`;
        }, 20);
      } else {
        slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
      }
    };

    const interval = setInterval(animateSlider, pauseLength);

    return () => clearInterval(interval);
  }, [extendedStatements.length, pauseLength]);

  return (
    <div className="overflow-hidden relative w-full flex justify-center">
      <div className="w-1/2 overflow-hidden" > {/* Adjusted width */}
        <div ref={sliderRef} className="flex transition-transform duration-1000 ease-in-out mb-1">
          {extendedStatements.map((statement, index) => (
            <div key={index} className="flex-none w-full text-center">
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                {statement}
              </h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfiniteTextSlider;


//INFINITE SLIDE NO PAUSE
// import React, { useEffect, useRef } from 'react';

// const InfiniteTextSlider: React.FC = () => {
//   const sliderRef = useRef<HTMLDivElement>(null);

//   const statements = [
//     "Impromptu Club Meeting?",
//     "Library too full?",
//     "Want a chalkboard?",
//     "Need a Projector?",
//   ];

//   useEffect(() => {
//     const slider = sliderRef.current;
//     if (!slider) return;

//     const totalWidth = slider.scrollWidth;
//     const slideWidth = totalWidth / (statements.length * 2);
//     let currentIndex = 0;

//     const animateSlider = () => {
//       currentIndex += 1;
//       if (currentIndex >= statements.length) {
//         currentIndex = 0;
//         slider.style.transition = 'none';
//         slider.style.transform = 'translateX(0)';
//         setTimeout(() => {
//           slider.style.transition = 'transform 1s ease-in-out';
//           slider.style.transform = `translateX(-${slideWidth}px)`;
//         }, 20);
//       } else {
//         slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
//       }
//     };

//     const interval = setInterval(animateSlider, 4000); // 4 seconds per statement

//     return () => clearInterval(interval);
//   }, [statements.length]);

//   return (
//     <div className="overflow-hidden relative w-full flex justify-center">
//       <div className="w-1/3 overflow-hidden">
//         <div ref={sliderRef} className="flex transition-transform duration-1000 ease-in-out">
//           {statements.concat(statements).map((statement, index) => (
//             <div key={index} className="flex-none w-full text-center">
//               <span className="text-xl font-bold">{statement}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };