import {SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

const App = () => {
  return (
    <>
      <SignedOut>
        <SignInButton mode='modal'/>
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  );
};

export default App;
