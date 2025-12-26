export interface GenerationResult {
  imageUrl: string;
  originalUrl: string;
  timestamp: number;
}

export interface HairColor {
  id: string;
  name: string;
  label: string;
  hex: string;
  prompt: string;
}

export interface FringeStyle {
  id: string;
  label: string;
  prompt: string;
}

export interface MakeupStyle {
  id: string;
  label: string;
  prompt: string;
}

export interface ClothingStyle {
  id: string;
  label: string;
  prompt: string;
}

export interface EarringStyle {
  id: string;
  label: string;
  prompt: string;
}

export interface GestureStyle {
  id: string;
  label: string;
  prompt: string;
}

export interface ExpressionStyle {
  id: string;
  label: string;
  prompt: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export const HAIR_COLORS: HairColor[] = [
  { id: 'silver', name: 'Silver White', label: '银白', hex: '#E5E7EB', prompt: 'silvery-white' },
  { id: 'black', name: 'Natural Black', label: '黑色', hex: '#111827', prompt: 'deep natural silk-black' },
  { id: 'grey', name: 'Charcoal Grey', label: '灰色', hex: '#6B7280', prompt: 'sophisticated charcoal grey' },
  { id: 'golden', name: 'Golden Blonde', label: '金黄', hex: '#FACC15', prompt: 'shimmering golden blonde' },
  { id: 'honey', name: 'Honey Yellow', label: '蜜糖黄', hex: '#FDE047', prompt: 'warm trendy honey yellow' },
  { id: 'amber', name: 'Amber Yellow', label: '琥珀黄', hex: '#FB923C', prompt: 'rich amber yellow' },
  { id: 'pearl', name: 'Pearl White', label: '珍珠白', hex: '#F9FAFB', prompt: 'luminous pearl-white' },
  { id: 'platinum', name: 'Platinum White', label: '铂金白', hex: '#D1D5DB', prompt: 'metallic platinum-white' },
  { id: 'pink', name: 'Pastel Pink', label: '樱花粉', hex: '#FBCFE8', prompt: 'soft pastel pink' },
  { id: 'green', name: 'Emerald Green', label: '翡翠绿', hex: '#A7F3D0', prompt: 'vibrant emerald green' },
  { id: 'blue', name: 'Electric Blue', label: '深邃蓝', hex: '#93C5FD', prompt: 'deep electric blue' },
  { id: 'purple', name: 'Royal Purple', label: '丁香紫', hex: '#DDD6FE', prompt: 'elegant royal purple' },
];

export const FRINGE_STYLES: FringeStyle[] = [
  { id: 'auto', label: '自动', prompt: 'a natural hairstyle that suits their face' },
  { id: 'straight', label: '齐刘海', prompt: 'thick, straight-across blunt bangs' },
  { id: 'side', label: '斜刘海', prompt: 'elegant side-swept bangs' },
  { id: 'curtain', label: '八字刘海', prompt: 'stylish curtain bangs parted in the middle' },
  { id: 'wispy', label: '空气刘海', prompt: 'soft, thin wispy air bangs' },
];

export const MAKEUP_STYLES: MakeupStyle[] = [
  { id: 'none', label: '无妆容', prompt: 'no makeup, completely natural skin texture' },
  { id: 'clear_water', label: '白开水妆', prompt: 'ultra-minimalist "clear water" makeup, translucent skin, almost invisible enhancements, pure and clean look' },
  { id: 'fox', label: '狐系妆容', prompt: 'seductive fox-eye makeup style, featuring sharp elongated eyeliner, upturned eye corners, alluring warm tones, and sophisticated contouring for a mysterious and charming aesthetic' },
  { id: 'asian', label: '亚裔妆', prompt: 'elegant classic Asian makeup style, enhancing natural features with soft contouring, warm tones, and graceful eye definition' },
  { id: 'korean', label: '韩系淡妆', prompt: 'light Korean-style makeup, soft dewy skin, subtle natural lip tint, delicate eyeliner' },
  { id: 'korean_lead', label: '韩系女主妆', prompt: 'elegant Korean lead actress makeup, radiant and sophisticated skin, polished eye definition, premium aesthetic' },
  { id: 'fashion', label: '时尚美妆', prompt: 'sophisticated fashion makeup, editorial style, defined eye shadows, bold but elegant aesthetics' },
];

export const CLOTHING_STYLES: ClothingStyle[] = [
  { id: 'tshirt', label: '简约白T', prompt: 'a stylish oversized white t-shirt with a loose, relaxed fit. The fabric is a high-quality lightweight cotton that is slightly translucent, subtly revealing the vague silhouette of a delicate piece of white lingerie underneath, creating a pure yet alluring aesthetic.' },
  { id: 'black_dress', label: '黑色小裙', prompt: 'a chic and stylish classic little black dress (LBD), sophisticated minimalist design, elegant and modern silhouette, perfect for a high-end fashion portrait.' },
  { id: 'uniform', label: '学院风制服', prompt: 'classic high school academy uniform, pink collar, youthful and scholarly' },
  { id: 'hoodie', label: '宽松连帽卫衣', prompt: 'a premium oversized hip-hop style hoodie from an international luxury fashion brand (like Balenciaga or Off-White), featuring bold designer graphics, heavy cotton textures, and a bureaucratic urban streetwear aesthetic.' },
  { id: 'ancient', label: '古装', prompt: 'a stunningly beautiful and sophisticated modern Hanfu or traditional ancient Chinese garment, featuring intricate embroidery, elegant flowing fabrics, and a contemporary aesthetic as seen in high-end cinematic ancient drama posters.' },
  { id: 'techwear', label: '机能运动风', prompt: 'modern techwear style, dark tactical fabrics, edgy and cool street aesthetic' },
  { id: 'big_shirt', label: '白色大衬衫', prompt: 'an oversized crisp white button-down shirt made of a delicate, high-end fabric that is slightly translucent and faintly see-through in a subtle, elegant way. One side of the shirt drapes off-the-shoulder to reveal her shoulder and collarbone, creating a sophisticated and alluring aesthetic while maintaining a pure, just-woke-up look.' },
  { id: 'bikini', label: '比基尼', prompt: 'a stylish and elegant high-end bikini swimwear, aesthetic presentation, sophisticated beach or studio fashion, featuring a petite and slender flat-chested A-cup bustline.' },
];

export const EARRING_STYLES: EarringStyle[] = [
  { id: 'none', label: '无', prompt: 'She is not wearing any earrings.' },
  { id: 'pearl', label: '珍珠耳钉', prompt: 'She is wearing elegant, minimalist pearl stud earrings that add a touch of classic sophistication.' },
  { id: 'hoops', label: '银色圆环', prompt: 'She is wearing stylish medium-sized silver hoop earrings, giving her a modern and edgy look.' },
  { id: 'drop', label: '水晶吊坠', prompt: 'She is wearing exquisite crystal drop earrings that sparkle under the studio lights, creating a high-end fashion aesthetic.' },
];

export const GESTURE_STYLES: GestureStyle[] = [
  { id: 'none', label: '无', prompt: 'Her hands are not visible in the frame, or resting naturally at her sides.' },
  { id: 'auto', label: '自动', prompt: 'She is posing with a natural, professional modeling gesture that complements her face.' },
  { id: 'v_sign', label: '剪刀手', prompt: 'She is making a cute and playful V-sign (peace sign) with her hand near her face.' },
  { id: 'heart', label: '比心', prompt: 'She is making a charming finger-heart gesture with her hand, looking warmly at the camera.' },
  { id: 'chin_rest', label: '托腮', prompt: 'She is resting her chin gently on one hand, creating a thoughtful and graceful aesthetic.' },
  { id: 'beckoning', label: '勾引', prompt: 'She has one hand elegantly raised with the arm slightly bent. The palm is held slightly open, and the other fingers are naturally and gracefully curved. Her index finger is prominently extended and slightly bent, making a gentle, rhythmic "come-hither" hooking motion, as if she is alluringly summoning the viewer to come closer. Crucially, the thumb is tucked behind the palm and is not visible in the frame. The gesture is magnetic, seductive, and full of sophisticated charm.' },
];

export const EXPRESSION_STYLES: ExpressionStyle[] = [
  { id: 'auto', label: '自动', prompt: 'a natural and captivating facial expression that suits the mood' },
  { id: 'none', label: '娇羞', prompt: 'a shy and coy facial expression, with a soft subtle blush on the cheeks, gently biting her lower lip in an endearing and nervous way, looking slightly away or down with an innocent and sweet gaze' },
  { id: 'sexy', label: '性感', prompt: 'a sophisticated and effortlessly sexy expression with a touch of languid charm. Her eyes have a soft, dreamy, and slightly heavy-lidded lazy gaze (慵懒的眼神). Her lips are naturally and slightly parted in a relaxed, cool way. The expression is magnetic, confident, and full of sophisticated allure.' },
  { id: 'slight_smile', label: '微笑', prompt: 'a subtle, elegant, and gentle slight smile, radiating a soft and friendly warmth' },
  { id: 'smile', label: '笑', prompt: 'a bright, warm, and radiant smile. The smile should look natural and authentic, following the character of the reference.' },
];