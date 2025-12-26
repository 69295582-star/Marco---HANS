import { GoogleGenAI } from "@google/genai";
import { HairColor, FringeStyle, MakeupStyle, ClothingStyle, EarringStyle, GestureStyle, ExpressionStyle } from "../types";

export const generateStyledPortrait = async (
  base64Image: string, 
  mimeType: string, 
  selectedColor: HairColor,
  selectedFringe: FringeStyle,
  hasCap: boolean,
  selectedMakeup: MakeupStyle,
  selectedClothing: ClothingStyle,
  selectedEarrings: EarringStyle,
  selectedGesture: GestureStyle,
  selectedExpression: ExpressionStyle,
  smileReferenceBase64?: string,
  smileReferenceMimeType?: string
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const isAncient = selectedClothing.id === 'ancient';

  let stylingInstructions = '';
  
  if (isAncient) {
    stylingInstructions = `
    CLOTHING & THEME: ${selectedClothing.prompt}.
    AI CREATIVE CONTROL: Since this is a specialized ANCIENT STYLE (古装) theme, you have absolute creative freedom to design the hair color (keep it elegant and fitting), an elaborate traditional hairstyle, delicate ancient-style makeup, and exquisite jewelry/accessories to perfectly match the costume. Create a stunning, cinematic, high-end cohesive look where all elements work together for a modern "ancient drama" aesthetic.
    `;
  } else {
    const capPrompt = hasCap 
      ? "She is wearing a stylish, modern baseball cap that complements her look. Her long hair flows gracefully from underneath the cap." 
      : "She is not wearing any headwear or caps.";

    stylingInstructions = `
    HAIR: Stunningly long, voluminous, flowing ${selectedColor.prompt} hair with ${selectedFringe.prompt}.
    ${capPrompt}
    MAKEUP: ${selectedMakeup.prompt}.
    CLOTHING: ${selectedClothing.prompt}.
    ACCESSORIES: ${selectedEarrings.prompt}
    `;
  }

  const gesturePrompt = `POSE & GESTURE: ${selectedGesture.prompt}`;
  const expressionPrompt = `EXPRESSION: ${selectedExpression.prompt}. ${
    smileReferenceBase64 ? "Refer to the second provided image for the specific character of her smile and facial expression." : ""
  }`;

  const prompt = `A professional high-end studio photography close-up portrait of a youthful girl. 
    ${stylingInstructions}
    ${gesturePrompt}
    ${expressionPrompt}
    
    SETTING: A high-end photography studio with professional softbox lighting and a clean, neutral, seamless backdrop. 
    AESTHETIC: A "youthful portrait" (青春写真) with a soft, clean, and elegant feel.
    
    CRITICAL IDENTITY PRESERVATION: 
    1. The facial features, bone structure, and eyes must remain 100% IDENTICAL to the person in the provided reference image (Image 1).
    2. Maintain the exact proportions of the nose, mouth, eyes, and chin from the reference. This is a transformation of the *same* person, not a new person.
    3. The output must be a single high-quality image part.
    4. 8k resolution, editorial quality, realistic skin texture, realistic hair rendering.`;

  const parts: any[] = [
    {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    }
  ];

  if (smileReferenceBase64 && smileReferenceMimeType) {
    parts.push({
      inlineData: {
        data: smileReferenceBase64,
        mimeType: smileReferenceMimeType,
      },
    });
  }

  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: parts },
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        }
      }
    });

    let generatedImageUrl = '';
    let refusalText = '';
    
    const candidatesParts = response.candidates?.[0]?.content?.parts || [];
    
    for (const part of candidatesParts) {
      if (part.inlineData) {
        generatedImageUrl = `data:image/png;base64,${part.inlineData.data}`;
      } else if (part.text) {
        refusalText += part.text;
      }
    }

    if (!generatedImageUrl) {
      if (refusalText) {
        throw new Error(`The AI declined to generate the image: ${refusalText}`);
      }
      throw new Error("No image data was found in the AI response. This often happens if the input photo is unclear or triggers safety filters.");
    }

    return generatedImageUrl;
  } catch (error) {
    console.error("Gemini API Error details:", error);
    throw error;
  }
};