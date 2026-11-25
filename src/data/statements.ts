import type { StatementTemplate } from './types';

export const BUILT_IN_STATEMENTS: StatementTemplate[] = [
  // BIM Statements (8)
  {
    id: 'bim-stmt-greeting',
    languageId: 'bim',
    titleEn: 'Morning greeting',
    titleBm: 'Sapaan pagi',
    translationEn: 'Good morning, how are you?',
    translationBm: 'Selamat pagi, apa khabar?',
    signIds: ['bim-everyday-selamat-pagi', 'bim-everyday-apa-khabar']
  },
  {
    id: 'bim-stmt-happy-see',
    languageId: 'bim',
    titleEn: 'Warm farewell',
    titleBm: 'Ucapan perpisahan ceria',
    translationEn: 'I am happy, see you again',
    translationBm: 'Saya gembira, jumpa lagi',
    signIds: ['bim-everyday-saya', 'bim-feelings-gembira', 'bim-everyday-jumpa-lagi']
  },
  {
    id: 'bim-stmt-hungry-eat',
    languageId: 'bim',
    titleEn: 'Meal time',
    titleBm: 'Waktu makan',
    translationEn: 'I am hungry to eat',
    translationBm: 'Saya lapar, mahu makan',
    signIds: ['bim-everyday-saya', 'bim-feelings-lapar', 'bim-everyday-makan']
  },
  {
    id: 'bim-stmt-help-confused',
    languageId: 'bim',
    titleEn: 'Ask for clarity',
    titleBm: 'Minta penerangan',
    translationEn: 'Please help me, I do not understand',
    translationBm: 'Tolong saya, saya tidak faham',
    signIds: ['bim-everyday-tolong', 'bim-everyday-saya', 'bim-feelings-tidak-faham']
  },
  {
    id: 'bim-stmt-love-parents',
    languageId: 'bim',
    titleEn: 'Family affection',
    titleBm: 'Kasih keluarga',
    translationEn: 'I love mother and father',
    translationBm: 'Saya sayang ibu dan ayah',
    signIds: ['bim-everyday-saya', 'bim-everyday-sayang', 'bim-people-ibu', 'bim-people-ayah']
  },
  {
    id: 'bim-stmt-sorry-wait',
    languageId: 'bim',
    titleEn: 'Polite pause',
    titleBm: 'Mohon tunggu',
    translationEn: 'Sorry, wait for me',
    translationBm: 'Maaf, tunggu saya',
    signIds: ['bim-everyday-maaf', 'bim-feelings-tunggu', 'bim-everyday-saya']
  },
  {
    id: 'bim-stmt-thanks-friend',
    languageId: 'bim',
    titleEn: 'Thanking a friend',
    titleBm: 'Terima kasih sahabat',
    translationEn: 'Thank you, good friend',
    translationBm: 'Terima kasih, kawan baik',
    signIds: ['bim-everyday-terima-kasih', 'bim-everyday-kawan', 'bim-everyday-bagus']
  },
  {
    id: 'bim-stmt-tired-sleep',
    languageId: 'bim',
    titleEn: 'Rest time',
    titleBm: 'Waktu rehat',
    translationEn: 'I am tired to sleep',
    translationBm: 'Saya penat, mahu tidur',
    signIds: ['bim-everyday-saya', 'bim-feelings-penat', 'bim-everyday-tidur']
  },

  // ASL Statements (8)
  {
    id: 'asl-stmt-hello-friend',
    languageId: 'asl',
    titleEn: 'Friendly hello',
    titleBm: 'Sapaan mesra',
    translationEn: 'Hello, good friend',
    translationBm: 'Helo, kawan baik',
    signIds: ['asl-everyday-hello', 'asl-everyday-friend', 'asl-everyday-good']
  },
  {
    id: 'asl-stmt-thanks-help',
    languageId: 'asl',
    titleEn: 'Grateful for help',
    titleBm: 'Menghargai bantuan',
    translationEn: 'Thank you for more help',
    translationBm: 'Terima kasih atas bantuan lagi',
    signIds: ['asl-everyday-thank-you', 'asl-everyday-help', 'asl-everyday-more']
  },
  {
    id: 'asl-stmt-please-learn',
    languageId: 'asl',
    titleEn: 'Study together',
    titleBm: 'Belajar bersama',
    translationEn: 'Please wait and learn',
    translationBm: 'Sila tunggu dan belajar',
    signIds: ['asl-everyday-please', 'asl-feelings-wait', 'asl-everyday-learn']
  },
  {
    id: 'asl-stmt-hurt-doctor',
    languageId: 'asl',
    titleEn: 'Medical need',
    titleBm: 'Keperluan rawatan',
    translationEn: 'Sorry, hurt — need doctor',
    translationBm: 'Maaf, sakit — perlu doktor',
    signIds: ['asl-everyday-sorry', 'asl-feelings-hurt', 'asl-people-doctor']
  },
  {
    id: 'asl-stmt-love-parents',
    languageId: 'asl',
    titleEn: 'Love parents',
    titleBm: 'Sayang ibu bapa',
    translationEn: 'Mother, father, I love you',
    translationBm: 'Ibu, ayah, saya sayang awak',
    signIds: ['asl-people-mother', 'asl-people-father', 'asl-everyday-ily']
  },
  {
    id: 'asl-stmt-eat-water',
    languageId: 'asl',
    titleEn: 'Food and water',
    titleBm: 'Makan dan air',
    translationEn: 'Eat and drink water',
    translationBm: 'Makan dan minum air',
    signIds: ['asl-everyday-eat', 'asl-everyday-drink', 'asl-everyday-water']
  },
  {
    id: 'asl-stmt-happy-home',
    languageId: 'asl',
    titleEn: 'Happy home',
    titleBm: 'Keluarga bahagia',
    translationEn: 'Happy family home',
    translationBm: 'Keluarga bahagia di rumah',
    signIds: ['asl-feelings-happy', 'asl-people-family', 'asl-everyday-home']
  },
  {
    id: 'asl-stmt-tired-bye',
    languageId: 'asl',
    titleEn: 'Goodnight farewell',
    titleBm: 'Ucapan selamat malam',
    translationEn: 'Tired, sleep, goodbye',
    translationBm: 'Penat, tidur, selamat tinggal',
    signIds: ['asl-feelings-tired', 'asl-everyday-sleep', 'asl-everyday-goodbye']
  }
];

export function getStatementsForLanguage(languageId: string): StatementTemplate[] {
  return BUILT_IN_STATEMENTS.filter((s) => s.languageId === languageId);
}
