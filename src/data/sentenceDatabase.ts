// German Sentence Database for Satz-Splitter
// Sentences organized by CEFR level with proper German word order

export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface SentenceWord {
  word: string;
  position: number; // The correct position in the sentence (1-indexed)
  type: 'subject' | 'verb' | 'object' | 'time' | 'place' | 'auxiliary' | 'particle' | 'conjunction';
}

export interface Sentence {
  id: string;
  level: Level;
  words: SentenceWord[];
  english: string;
  hint?: string;
}

// Helper to create sentence words easily
const createSentence = (
  id: string,
  level: Level,
  english: string,
  words: [string, SentenceWord['type']][],
  hint?: string
): Sentence => ({
  id,
  level,
  english,
  words: words.map(([word, type], index) => ({
    word,
    position: index + 1,
    type,
  })),
  hint,
});

export const SENTENCE_DATABASE: Record<Level, Sentence[]> = {
  A1: [
    // Main clauses - Verb in position 2
    createSentence('a1-1', 'A1', 'I am drinking water.', [
      ['Ich', 'subject'],
      ['trinke', 'verb'],
      ['Wasser', 'object'],
    ]),
    createSentence('a1-2', 'A1', 'She reads a book.', [
      ['Sie', 'subject'],
      ['liest', 'verb'],
      ['ein', 'object'],
      ['Buch', 'object'],
    ]),
    createSentence('a1-3', 'A1', 'The man is eating.', [
      ['Der', 'subject'],
      ['Mann', 'subject'],
      ['isst', 'verb'],
    ]),
    createSentence('a1-4', 'A1', 'We are learning German.', [
      ['Wir', 'subject'],
      ['lernen', 'verb'],
      ['Deutsch', 'object'],
    ]),
    createSentence('a1-5', 'A1', 'Today I go home.', [
      ['Heute', 'time'],
      ['gehe', 'verb'],
      ['ich', 'subject'],
      ['nach', 'place'],
      ['Hause', 'place'],
    ], 'Time expression in position 1 pushes verb before subject'),
    createSentence('a1-6', 'A1', 'The child plays.', [
      ['Das', 'subject'],
      ['Kind', 'subject'],
      ['spielt', 'verb'],
    ]),
    createSentence('a1-7', 'A1', 'He sleeps well.', [
      ['Er', 'subject'],
      ['schläft', 'verb'],
      ['gut', 'object'],
    ]),
    createSentence('a1-8', 'A1', 'The dog runs.', [
      ['Der', 'subject'],
      ['Hund', 'subject'],
      ['läuft', 'verb'],
    ]),
    createSentence('a1-9', 'A1', 'I have a cat.', [
      ['Ich', 'subject'],
      ['habe', 'verb'],
      ['eine', 'object'],
      ['Katze', 'object'],
    ]),
    createSentence('a1-10', 'A1', 'She cooks food.', [
      ['Sie', 'subject'],
      ['kocht', 'verb'],
      ['Essen', 'object'],
    ]),
  ],
  A2: [
    // More complex main clauses with time/place
    createSentence('a2-1', 'A2', 'Tomorrow we drive to Berlin.', [
      ['Morgen', 'time'],
      ['fahren', 'verb'],
      ['wir', 'subject'],
      ['nach', 'place'],
      ['Berlin', 'place'],
    ]),
    createSentence('a2-2', 'A2', 'I would like to have a coffee.', [
      ['Ich', 'subject'],
      ['möchte', 'verb'],
      ['einen', 'object'],
      ['Kaffee', 'object'],
      ['haben', 'verb'],
    ]),
    createSentence('a2-3', 'A2', 'Yesterday I bought a car.', [
      ['Gestern', 'time'],
      ['habe', 'auxiliary'],
      ['ich', 'subject'],
      ['ein', 'object'],
      ['Auto', 'object'],
      ['gekauft', 'verb'],
    ]),
    createSentence('a2-4', 'A2', 'In summer we go swimming.', [
      ['Im', 'time'],
      ['Sommer', 'time'],
      ['gehen', 'verb'],
      ['wir', 'subject'],
      ['schwimmen', 'verb'],
    ]),
    createSentence('a2-5', 'A2', 'The children play in the park.', [
      ['Die', 'subject'],
      ['Kinder', 'subject'],
      ['spielen', 'verb'],
      ['im', 'place'],
      ['Park', 'place'],
    ]),
    createSentence('a2-6', 'A2', 'I can speak German.', [
      ['Ich', 'subject'],
      ['kann', 'verb'],
      ['Deutsch', 'object'],
      ['sprechen', 'verb'],
    ]),
    createSentence('a2-7', 'A2', 'We must go home now.', [
      ['Wir', 'subject'],
      ['müssen', 'verb'],
      ['jetzt', 'time'],
      ['nach', 'place'],
      ['Hause', 'place'],
      ['gehen', 'verb'],
    ]),
    createSentence('a2-8', 'A2', 'He wants to visit his friend.', [
      ['Er', 'subject'],
      ['will', 'verb'],
      ['seinen', 'object'],
      ['Freund', 'object'],
      ['besuchen', 'verb'],
    ]),
  ],
  B1: [
    // Subordinate clauses with weil/dass - verb at end
    createSentence('b1-1', 'B1', 'I know that he is coming.', [
      ['Ich', 'subject'],
      ['weiß', 'verb'],
      ['dass', 'conjunction'],
      ['er', 'subject'],
      ['kommt', 'verb'],
    ], 'In \"dass\" clauses, the verb goes to the end'),
    createSentence('b1-2', 'B1', 'Because he is tired, he sleeps.', [
      ['Weil', 'conjunction'],
      ['er', 'subject'],
      ['müde', 'object'],
      ['ist', 'verb'],
      ['schläft', 'verb'],
      ['er', 'subject'],
    ]),
    createSentence('b1-3', 'B1', 'I think that it is good.', [
      ['Ich', 'subject'],
      ['denke', 'verb'],
      ['dass', 'conjunction'],
      ['es', 'subject'],
      ['gut', 'object'],
      ['ist', 'verb'],
    ]),
    createSentence('b1-4', 'B1', 'Although she is sick, she works.', [
      ['Obwohl', 'conjunction'],
      ['sie', 'subject'],
      ['krank', 'object'],
      ['ist', 'verb'],
      ['arbeitet', 'verb'],
      ['sie', 'subject'],
    ]),
    createSentence('b1-5', 'B1', 'When I come home, I eat.', [
      ['Wenn', 'conjunction'],
      ['ich', 'subject'],
      ['nach', 'place'],
      ['Hause', 'place'],
      ['komme', 'verb'],
      ['esse', 'verb'],
      ['ich', 'subject'],
    ]),
    createSentence('b1-6', 'B1', 'I hope that you are well.', [
      ['Ich', 'subject'],
      ['hoffe', 'verb'],
      ['dass', 'conjunction'],
      ['es', 'subject'],
      ['dir', 'object'],
      ['gut', 'object'],
      ['geht', 'verb'],
    ]),
  ],
  B2: [
    // Complex subordinate clauses with multiple parts
    createSentence('b2-1', 'B2', 'If I had more time, I would read more.', [
      ['Wenn', 'conjunction'],
      ['ich', 'subject'],
      ['mehr', 'object'],
      ['Zeit', 'object'],
      ['hätte', 'verb'],
      ['würde', 'auxiliary'],
      ['ich', 'subject'],
      ['mehr', 'object'],
      ['lesen', 'verb'],
    ]),
    createSentence('b2-2', 'B2', 'The book that I read was interesting.', [
      ['Das', 'subject'],
      ['Buch', 'subject'],
      ['das', 'conjunction'],
      ['ich', 'subject'],
      ['gelesen', 'verb'],
      ['habe', 'auxiliary'],
      ['war', 'verb'],
      ['interessant', 'object'],
    ]),
    createSentence('b2-3', 'B2', 'Although it was raining, we went out.', [
      ['Obwohl', 'conjunction'],
      ['es', 'subject'],
      ['geregnet', 'verb'],
      ['hat', 'auxiliary'],
      ['sind', 'auxiliary'],
      ['wir', 'subject'],
      ['ausgegangen', 'verb'],
    ]),
    createSentence('b2-4', 'B2', 'I wonder whether he comes.', [
      ['Ich', 'subject'],
      ['frage', 'verb'],
      ['mich', 'object'],
      ['ob', 'conjunction'],
      ['er', 'subject'],
      ['kommt', 'verb'],
    ]),
  ],
  C1: [
    // Passive voice and complex constructions
    createSentence('c1-1', 'C1', 'The work was completed yesterday.', [
      ['Die', 'subject'],
      ['Arbeit', 'subject'],
      ['wurde', 'auxiliary'],
      ['gestern', 'time'],
      ['fertiggestellt', 'verb'],
    ], 'Passive voice: werden + past participle'),
    createSentence('c1-2', 'C1', 'This should have been done earlier.', [
      ['Das', 'subject'],
      ['hätte', 'auxiliary'],
      ['früher', 'time'],
      ['gemacht', 'verb'],
      ['werden', 'auxiliary'],
      ['sollen', 'verb'],
    ]),
    createSentence('c1-3', 'C1', 'The extensively discussed topic was resolved.', [
      ['Das', 'subject'],
      ['ausführlich', 'object'],
      ['besprochene', 'object'],
      ['Thema', 'subject'],
      ['wurde', 'auxiliary'],
      ['geklärt', 'verb'],
    ], 'Extended participial construction before noun'),
    createSentence('c1-4', 'C1', 'Without considering the consequences, he acted.', [
      ['Ohne', 'conjunction'],
      ['die', 'object'],
      ['Folgen', 'object'],
      ['zu', 'particle'],
      ['bedenken', 'verb'],
      ['handelte', 'verb'],
      ['er', 'subject'],
    ]),
  ],
  C2: [
    // Literary and highly complex structures
    createSentence('c2-1', 'C2', 'The decision, hard as it was, had to be made.', [
      ['Die', 'subject'],
      ['Entscheidung', 'subject'],
      ['so', 'conjunction'],
      ['schwer', 'object'],
      ['sie', 'subject'],
      ['auch', 'particle'],
      ['war', 'verb'],
      ['musste', 'auxiliary'],
      ['getroffen', 'verb'],
      ['werden', 'auxiliary'],
    ]),
    createSentence('c2-2', 'C2', 'Were it not for him, we would have failed.', [
      ['Wäre', 'auxiliary'],
      ['er', 'subject'],
      ['nicht', 'particle'],
      ['gewesen', 'verb'],
      ['hätten', 'auxiliary'],
      ['wir', 'subject'],
      ['versagt', 'verb'],
    ], 'Subjunctive II without \"wenn\" - verb in position 1'),
    createSentence('c2-3', 'C2', 'The by many expected breakthrough did not come.', [
      ['Der', 'subject'],
      ['von', 'object'],
      ['vielen', 'object'],
      ['erwartete', 'object'],
      ['Durchbruch', 'subject'],
      ['blieb', 'verb'],
      ['aus', 'particle'],
    ]),
  ],
};

// Level metadata for Satz-Splitter
export const SENTENCE_LEVEL_INFO: Record<Level, { name: string; description: string; timeLimit: number }> = {
  A1: { name: 'A1', description: 'Simple main clauses', timeLimit: 30 },
  A2: { name: 'A2', description: 'Time & Place expressions', timeLimit: 25 },
  B1: { name: 'B1', description: 'Subordinate clauses', timeLimit: 22 },
  B2: { name: 'B2', description: 'Complex conjunctions', timeLimit: 18 },
  C1: { name: 'C1', description: 'Passive constructions', timeLimit: 15 },
  C2: { name: 'C2', description: 'Literary structures', timeLimit: 12 },
};

// Get random sentence from level
export const getRandomSentence = (level: Level): Sentence => {
  const sentences = SENTENCE_DATABASE[level];
  return sentences[Math.floor(Math.random() * sentences.length)];
};

// Shuffle words for gameplay (keeping track of correct positions)
export const shuffleWords = (sentence: Sentence): SentenceWord[] => {
  const shuffled = [...sentence.words];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
