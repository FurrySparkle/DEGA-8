import pako from 'pako';



const cartridgeTemplate = (luaCode: string) => `
pico-8 cartridge // http://www.pico-8.com
version 32
__lua__
${luaCode}
`;



const encodeCartridge = (cartridge: string) => {
  const compressed = pako.deflate(cartridge, { to: 'string' });
  return btoa(compressed);
};

const updateGameCode = (newCode: string) => {
    try {
      const cartridge = cartridgeTemplate(newCode);
      const encodedCartridge = encodeCartridge(cartridge);
     // setCode(encodedCartridge);
    } catch (error) {
      console.error('Failed to update game code:', error);
      // Optionally, display an error message to the user
    }
  };
  
  