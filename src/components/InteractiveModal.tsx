import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface InteractiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCenterModel: () => void;
}

export const InteractiveModal: React.FC<InteractiveModalProps> = ({
  isOpen,
  onClose,
  onCenterModel,
}) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Entrance animation
      const tl = gsap.timeline();

      // Backdrop fade in
      tl.fromTo(
        backdropRef.current,
        { opacity: 0, backdropFilter: "blur(0px)" },
        {
          opacity: 1,
          backdropFilter: "blur(5px)",
          duration: 0.3,
          ease: "power2.out",
        }
      );

      // Modal content entrance
      tl.fromTo(
        contentRef.current,
        {
          scale: 0.8,
          opacity: 0,
          y: 50,
          rotationX: 15,
          transformOrigin: "center center",
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
        "-=0.2"
      );

      // Stagger text elements
      tl.fromTo(
        [titleRef.current, descriptionRef.current],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" },
        "-=0.3"
      );

      // Buttons entrance
      tl.fromTo(
        buttonsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
        "-=0.2"
      );
    } else {
      // Exit animation
      const tl = gsap.timeline();

      // Content exit
      tl.to(contentRef.current, {
        scale: 0.8,
        opacity: 0,
        y: -30,
        rotationX: -15,
        duration: 0.3,
        ease: "power2.in",
      });

      // Backdrop fade out
      tl.to(
        backdropRef.current,
        {
          opacity: 0,
          backdropFilter: "blur(0px)",
          duration: 0.3,
          ease: "power2.in",
        },
        "-=0.2"
      );
    }
  }, [isOpen]);

  const handleButtonHover = (
    button: HTMLButtonElement,
    isHovering: boolean
  ) => {
    gsap.to(button, {
      scale: isHovering ? 1.05 : 1,
      duration: 0.2,
      ease: "power2.out",
    });

    gsap.to(button, {
      boxShadow: isHovering
        ? "0 10px 25px rgba(0,0,0,0.3)"
        : "0 5px 15px rgba(0,0,0,0.2)",
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const handleCenterModelClick = () => {
    // Button click animation
    const button = buttonsRef.current?.querySelector(
      "button"
    ) as HTMLButtonElement;
    if (button) {
      gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.in",
        onComplete: () => {
          gsap.to(button, {
            scale: 1,
            duration: 0.1,
            ease: "power2.out",
          });
        },
      });
    }

    // Modal exit animation before calling onCenterModel
    const tl = gsap.timeline({
      onComplete: onCenterModel,
    });

    tl.to(contentRef.current, {
      scale: 1.1,
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
    });

    tl.to(
      backdropRef.current,
      {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      },
      "-=0.2"
    );
  };

  const handleCloseClick = () => {
    // Button click animation
    const closeButton = buttonsRef.current?.querySelectorAll(
      "button"
    )[1] as HTMLButtonElement;
    if (closeButton) {
      gsap.to(closeButton, {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.in",
        onComplete: () => {
          gsap.to(closeButton, {
            scale: 1,
            duration: 0.1,
            ease: "power2.out",
          });
        },
      });
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        backdropFilter: "blur(5px)",
      }}
      onClick={onClose}
    >
      <div
        ref={contentRef}
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "2rem",
          borderRadius: "15px",
          color: "white",
          minWidth: "300px",
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          transform: "scale(0.8)",
          opacity: 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          ref={titleRef}
          style={{
            margin: "0 0 1rem 0",
            fontSize: "1.5rem",
            opacity: 0,
            transform: "translateY(20px)",
          }}
        >
          Interactive 3D Scene
        </h2>
        <p
          ref={descriptionRef}
          style={{
            margin: "0 0 1.5rem 0",
            opacity: 0,
            transform: "translateY(20px)",
          }}
        >
          Welcome to your interactive 3D environment! You can control the camera
          and explore the scene.
        </p>
        <div
          ref={buttonsRef}
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            opacity: 0,
            transform: "translateY(30px)",
          }}
        >
          <button
            onClick={handleCenterModelClick}
            onMouseEnter={(e) => handleButtonHover(e.currentTarget, true)}
            onMouseLeave={(e) => handleButtonHover(e.currentTarget, false)}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "all 0.3s ease",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            }}
          >
            Center Model
          </button>
          <button
            onClick={handleCloseClick}
            onMouseEnter={(e) => handleButtonHover(e.currentTarget, true)}
            onMouseLeave={(e) => handleButtonHover(e.currentTarget, false)}
            style={{
              background: "rgba(255, 107, 107, 0.8)",
              border: "none",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "all 0.3s ease",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
