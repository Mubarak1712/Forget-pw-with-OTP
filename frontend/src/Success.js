import React, { useEffect } from "react";

const Success = () => {
  useEffect(() => {
    const audio = new Audio("/success.mp3");
    audio.play();
  }, []);

  return (
    <div className="page">
      <h1 className="success-text">🎉 Password Reset Successful!</h1>
      <p>Your new password has been saved securely.</p>
      <img src="/celebrate.gif" alt="Celebration" className="celebrate-img" />
    </div>
  );
};

export default Success;
