import React from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';

const MyVideoCall = () => {
  return (
    <div style={{ height: '100vh', display: 'grid' }}>
      <JitsiMeeting
        domain="meet.jit.si" // Use your own domain if self-hosting
        roomName="UniqueRoomName123"
        configOverwrite={{
          startWithAudioMuted: true,
          disableModeratorIndicator: true,
          startScreenSharing: true,
          enableEmailInStats: false
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            SHOW_JITSI_WATERMARK: false,
            SHOW_BRAND_WATERMARK: false,
        }}
        userInfo={{
          displayName: 'User Name'
        }}
        onApiReady={(externalApi) => {
          // You can use the API to add event listeners or execute commands
          console.log('Jitsi Meet External API ready');
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '100%';
        }}
      />
    </div>
  );
};

export default MyVideoCall;