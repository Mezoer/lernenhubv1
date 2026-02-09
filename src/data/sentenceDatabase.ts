// German Sentence Database for Satz-Splitter
// Sentences organized by CEFR level with proper German word order
// Includes distractor words for added challenge

export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface SentenceWord {
  word: string;
  position: number; // The correct position in the sentence (1-indexed)
  type: 'subject' | 'verb' | 'object' | 'time' | 'place' | 'auxiliary' | 'particle' | 'conjunction' | 'article' | 'adjective';
  isDistractor?: boolean; // If true, this word should NOT be used
}

export interface Sentence {
  id: string;
  level: Level;
  words: SentenceWord[];
  distractors: SentenceWord[]; // False words to add to the pool
  english: string;
  hint?: string;
  explanation?: string; // For game over screen
}

// Helper to create sentence words easily
const createSentence = (
  id: string,
  level: Level,
  english: string,
  words: [string, SentenceWord['type']][],
  distractors: [string, SentenceWord['type']][],
  hint?: string,
  explanation?: string
): Sentence => ({
  id,
  level,
  english,
  words: words.map(([word, type], index) => ({
    word,
    position: index + 1,
    type,
    isDistractor: false,
  })),
  distractors: distractors.map(([word, type]) => ({
    word,
    position: -1,
    type,
    isDistractor: true,
  })),
  hint,
  explanation,
});

export const SENTENCE_DATABASE: Record<Level, Sentence[]> = {
  A1: [
    // === 50+ A1 Sentences - Simple main clauses, verb in position 2 ===
    createSentence('a1-1', 'A1', 'I am drinking water.', 
      [['Ich', 'subject'], ['trinke', 'verb'], ['Wasser', 'object']],
      [['trinkst', 'verb'], ['Milch', 'object']],
      'Subject + Verb + Object',
      'Basic SVO word order: Subject first, then verb, then object.'
    ),
    createSentence('a1-2', 'A1', 'She reads a book.',
      [['Sie', 'subject'], ['liest', 'verb'], ['ein', 'article'], ['Buch', 'object']],
      [['lesen', 'verb'], ['das', 'article']],
      'Conjugated verb for "sie"',
      '"Liest" is the correct conjugation for "sie" (she). "Lesen" is the infinitive.'
    ),
    createSentence('a1-3', 'A1', 'The man is eating.',
      [['Der', 'article'], ['Mann', 'subject'], ['isst', 'verb']],
      [['Die', 'article'], ['essen', 'verb']],
      'Masculine article for "Mann"',
      '"Der" is the masculine article for "Mann". "Die" would be feminine.'
    ),
    createSentence('a1-4', 'A1', 'We are learning German.',
      [['Wir', 'subject'], ['lernen', 'verb'], ['Deutsch', 'object']],
      [['lernst', 'verb'], ['Englisch', 'object']],
      'Verb conjugation for "wir"',
      '"Lernen" is correct for "wir". "Lernst" is for "du".'
    ),
    createSentence('a1-5', 'A1', 'Today I go home.',
      [['Heute', 'time'], ['gehe', 'verb'], ['ich', 'subject'], ['nach', 'particle'], ['Hause', 'place']],
      [['gehst', 'verb'], ['morgen', 'time']],
      'Time expression moves verb before subject',
      'When time (Heute) is first, the verb stays in position 2, pushing the subject after.'
    ),
    createSentence('a1-6', 'A1', 'The child plays.',
      [['Das', 'article'], ['Kind', 'subject'], ['spielt', 'verb']],
      [['Der', 'article'], ['spielen', 'verb']],
      '"Kind" is neuter',
      '"Das" is the neuter article for "Kind". Children are grammatically neuter in German.'
    ),
    createSentence('a1-7', 'A1', 'He sleeps well.',
      [['Er', 'subject'], ['schläft', 'verb'], ['gut', 'adjective']],
      [['schlafen', 'verb'], ['schlecht', 'adjective']],
      'Verb conjugation with umlaut',
      '"Schläft" has an umlaut change for er/sie/es forms.'
    ),
    createSentence('a1-8', 'A1', 'The dog runs.',
      [['Der', 'article'], ['Hund', 'subject'], ['läuft', 'verb']],
      [['Die', 'article'], ['laufen', 'verb']],
      '"Hund" is masculine',
      '"Der Hund" - dogs are grammatically masculine in German.'
    ),
    createSentence('a1-9', 'A1', 'I have a cat.',
      [['Ich', 'subject'], ['habe', 'verb'], ['eine', 'article'], ['Katze', 'object']],
      [['haben', 'verb'], ['ein', 'article']],
      '"Katze" is feminine',
      '"Eine Katze" - cats are grammatically feminine, so use "eine" not "ein".'
    ),
    createSentence('a1-10', 'A1', 'She cooks food.',
      [['Sie', 'subject'], ['kocht', 'verb'], ['Essen', 'object']],
      [['kochen', 'verb'], ['Er', 'subject']],
      'Verb conjugation for "sie"',
      '"Kocht" is correct for "sie". "Kochen" is the infinitive.'
    ),
    createSentence('a1-11', 'A1', 'You are nice.',
      [['Du', 'subject'], ['bist', 'verb'], ['nett', 'adjective']],
      [['bin', 'verb'], ['böse', 'adjective']],
      '"Sein" conjugation',
      '"Bist" is correct for "du". "Bin" is for "ich".'
    ),
    createSentence('a1-12', 'A1', 'I am happy.',
      [['Ich', 'subject'], ['bin', 'verb'], ['glücklich', 'adjective']],
      [['bist', 'verb'], ['traurig', 'adjective']],
      '"Sein" conjugation',
      '"Bin" is correct for "ich". "Bist" is for "du".'
    ),
    createSentence('a1-13', 'A1', 'The woman walks.',
      [['Die', 'article'], ['Frau', 'subject'], ['geht', 'verb']],
      [['Der', 'article'], ['gehen', 'verb']],
      '"Frau" is feminine',
      '"Die Frau" - women are grammatically feminine.'
    ),
    createSentence('a1-14', 'A1', 'They have children.',
      [['Sie', 'subject'], ['haben', 'verb'], ['Kinder', 'object']],
      [['hat', 'verb'], ['Kind', 'object']],
      'Plural verb form',
      '"Haben" is correct for "sie" (they). "Hat" is for er/sie/es.'
    ),
    createSentence('a1-15', 'A1', 'The sun shines.',
      [['Die', 'article'], ['Sonne', 'subject'], ['scheint', 'verb']],
      [['Der', 'article'], ['scheinen', 'verb']],
      '"Sonne" is feminine',
      '"Die Sonne" - the sun is grammatically feminine in German.'
    ),
    createSentence('a1-16', 'A1', 'I need help.',
      [['Ich', 'subject'], ['brauche', 'verb'], ['Hilfe', 'object']],
      [['brauchst', 'verb'], ['helfen', 'verb']],
      'Noun vs verb',
      '"Hilfe" is a noun. "Helfen" is the verb "to help".'
    ),
    createSentence('a1-17', 'A1', 'The bird flies.',
      [['Der', 'article'], ['Vogel', 'subject'], ['fliegt', 'verb']],
      [['Die', 'article'], ['fliegen', 'verb']],
      '"Vogel" is masculine',
      '"Der Vogel" - birds are grammatically masculine.'
    ),
    createSentence('a1-18', 'A1', 'We eat bread.',
      [['Wir', 'subject'], ['essen', 'verb'], ['Brot', 'object']],
      [['esst', 'verb'], ['Kuchen', 'object']],
      'Verb form for "wir"',
      '"Essen" is correct for "wir". "Esst" is for "ihr".'
    ),
    createSentence('a1-19', 'A1', 'The car is red.',
      [['Das', 'article'], ['Auto', 'subject'], ['ist', 'verb'], ['rot', 'adjective']],
      [['Der', 'article'], ['sind', 'verb']],
      '"Auto" is neuter',
      '"Das Auto" - cars are grammatically neuter.'
    ),
    createSentence('a1-20', 'A1', 'He has a dog.',
      [['Er', 'subject'], ['hat', 'verb'], ['einen', 'article'], ['Hund', 'object']],
      [['haben', 'verb'], ['ein', 'article']],
      'Accusative masculine',
      '"Einen" is accusative masculine. "Ein" is nominative.'
    ),
    createSentence('a1-21', 'A1', 'The girl sings.',
      [['Das', 'article'], ['Mädchen', 'subject'], ['singt', 'verb']],
      [['Die', 'article'], ['singen', 'verb']],
      '"Mädchen" is neuter',
      '"Das Mädchen" - diminutives (-chen) are always neuter.'
    ),
    createSentence('a1-22', 'A1', 'I love you.',
      [['Ich', 'subject'], ['liebe', 'verb'], ['dich', 'object']],
      [['liebst', 'verb'], ['dir', 'object']],
      'Accusative pronoun',
      '"Dich" is accusative. "Dir" is dative.'
    ),
    createSentence('a1-23', 'A1', 'The coffee is hot.',
      [['Der', 'article'], ['Kaffee', 'subject'], ['ist', 'verb'], ['heiß', 'adjective']],
      [['Das', 'article'], ['kalt', 'adjective']],
      '"Kaffee" is masculine',
      '"Der Kaffee" - coffee is grammatically masculine.'
    ),
    createSentence('a1-24', 'A1', 'She plays piano.',
      [['Sie', 'subject'], ['spielt', 'verb'], ['Klavier', 'object']],
      [['spielen', 'verb'], ['Gitarre', 'object']],
      'Verb conjugation',
      '"Spielt" is correct for "sie". "Spielen" is infinitive.'
    ),
    createSentence('a1-25', 'A1', 'The house is big.',
      [['Das', 'article'], ['Haus', 'subject'], ['ist', 'verb'], ['groß', 'adjective']],
      [['Der', 'article'], ['klein', 'adjective']],
      '"Haus" is neuter',
      '"Das Haus" - houses are grammatically neuter.'
    ),
    createSentence('a1-26', 'A1', 'I speak German.',
      [['Ich', 'subject'], ['spreche', 'verb'], ['Deutsch', 'object']],
      [['sprichst', 'verb'], ['Französisch', 'object']],
      'Verb conjugation',
      '"Spreche" is correct for "ich". "Sprichst" is for "du".'
    ),
    createSentence('a1-27', 'A1', 'The water is cold.',
      [['Das', 'article'], ['Wasser', 'subject'], ['ist', 'verb'], ['kalt', 'adjective']],
      [['Der', 'article'], ['warm', 'adjective']],
      '"Wasser" is neuter',
      '"Das Wasser" - water is grammatically neuter.'
    ),
    createSentence('a1-28', 'A1', 'He works here.',
      [['Er', 'subject'], ['arbeitet', 'verb'], ['hier', 'place']],
      [['arbeiten', 'verb'], ['dort', 'place']],
      'Verb conjugation',
      '"Arbeitet" is correct for "er". "Arbeiten" is infinitive.'
    ),
    createSentence('a1-29', 'A1', 'The flower is beautiful.',
      [['Die', 'article'], ['Blume', 'subject'], ['ist', 'verb'], ['schön', 'adjective']],
      [['Der', 'article'], ['hässlich', 'adjective']],
      '"Blume" is feminine',
      '"Die Blume" - flowers are grammatically feminine.'
    ),
    createSentence('a1-30', 'A1', 'We play football.',
      [['Wir', 'subject'], ['spielen', 'verb'], ['Fußball', 'object']],
      [['spielt', 'verb'], ['Tennis', 'object']],
      'Verb form for "wir"',
      '"Spielen" is correct for "wir". "Spielt" is for er/sie/es.'
    ),
    createSentence('a1-31', 'A1', 'The table is wooden.',
      [['Der', 'article'], ['Tisch', 'subject'], ['ist', 'verb'], ['aus', 'particle'], ['Holz', 'object']],
      [['Das', 'article'], ['Metall', 'object']],
      '"Tisch" is masculine',
      '"Der Tisch" - tables are grammatically masculine.'
    ),
    createSentence('a1-32', 'A1', 'I buy bread.',
      [['Ich', 'subject'], ['kaufe', 'verb'], ['Brot', 'object']],
      [['kaufst', 'verb'], ['Fleisch', 'object']],
      'Verb conjugation',
      '"Kaufe" is correct for "ich". "Kaufst" is for "du".'
    ),
    createSentence('a1-33', 'A1', 'The book is interesting.',
      [['Das', 'article'], ['Buch', 'subject'], ['ist', 'verb'], ['interessant', 'adjective']],
      [['Der', 'article'], ['langweilig', 'adjective']],
      '"Buch" is neuter',
      '"Das Buch" - books are grammatically neuter.'
    ),
    createSentence('a1-34', 'A1', 'She has blue eyes.',
      [['Sie', 'subject'], ['hat', 'verb'], ['blaue', 'adjective'], ['Augen', 'object']],
      [['haben', 'verb'], ['grüne', 'adjective']],
      'Verb form for "sie"',
      '"Hat" is correct for "sie" (she). "Haben" is for wir/sie(they).'
    ),
    createSentence('a1-35', 'A1', 'The child cries.',
      [['Das', 'article'], ['Kind', 'subject'], ['weint', 'verb']],
      [['Der', 'article'], ['weinen', 'verb']],
      '"Kind" is neuter',
      '"Das Kind" - children are grammatically neuter.'
    ),
    createSentence('a1-36', 'A1', 'I live in Berlin.',
      [['Ich', 'subject'], ['wohne', 'verb'], ['in', 'particle'], ['Berlin', 'place']],
      [['wohnst', 'verb'], ['München', 'place']],
      'Verb conjugation',
      '"Wohne" is correct for "ich". "Wohnst" is for "du".'
    ),
    createSentence('a1-37', 'A1', 'The moon shines.',
      [['Der', 'article'], ['Mond', 'subject'], ['scheint', 'verb']],
      [['Die', 'article'], ['leuchtet', 'verb']],
      '"Mond" is masculine',
      '"Der Mond" - the moon is grammatically masculine in German.'
    ),
    createSentence('a1-38', 'A1', 'We drink coffee.',
      [['Wir', 'subject'], ['trinken', 'verb'], ['Kaffee', 'object']],
      [['trinkt', 'verb'], ['Tee', 'object']],
      'Verb form for "wir"',
      '"Trinken" is correct for "wir". "Trinkt" is for er/sie/es.'
    ),
    createSentence('a1-39', 'A1', 'The door is open.',
      [['Die', 'article'], ['Tür', 'subject'], ['ist', 'verb'], ['offen', 'adjective']],
      [['Das', 'article'], ['geschlossen', 'adjective']],
      '"Tür" is feminine',
      '"Die Tür" - doors are grammatically feminine.'
    ),
    createSentence('a1-40', 'A1', 'He eats an apple.',
      [['Er', 'subject'], ['isst', 'verb'], ['einen', 'article'], ['Apfel', 'object']],
      [['essen', 'verb'], ['ein', 'article']],
      'Accusative masculine',
      '"Einen" is accusative. "Ein" would be nominative.'
    ),
    createSentence('a1-41', 'A1', 'The sister laughs.',
      [['Die', 'article'], ['Schwester', 'subject'], ['lacht', 'verb']],
      [['Der', 'article'], ['lachen', 'verb']],
      '"Schwester" is feminine',
      '"Die Schwester" - sisters are grammatically feminine.'
    ),
    createSentence('a1-42', 'A1', 'I watch TV.',
      [['Ich', 'subject'], ['sehe', 'verb'], ['fern', 'particle']],
      [['siehst', 'verb'], ['Kino', 'object']],
      'Separable verb',
      '"Fernsehen" is a separable verb. "Fern" goes to the end.'
    ),
    createSentence('a1-43', 'A1', 'The brother sleeps.',
      [['Der', 'article'], ['Bruder', 'subject'], ['schläft', 'verb']],
      [['Die', 'article'], ['schlafen', 'verb']],
      '"Bruder" is masculine',
      '"Der Bruder" - brothers are grammatically masculine.'
    ),
    createSentence('a1-44', 'A1', 'We travel tomorrow.',
      [['Wir', 'subject'], ['reisen', 'verb'], ['morgen', 'time']],
      [['reist', 'verb'], ['heute', 'time']],
      'Verb form for "wir"',
      '"Reisen" is correct for "wir". "Reist" is for du/er/sie/es.'
    ),
    createSentence('a1-45', 'A1', 'The window is clean.',
      [['Das', 'article'], ['Fenster', 'subject'], ['ist', 'verb'], ['sauber', 'adjective']],
      [['Der', 'article'], ['schmutzig', 'adjective']],
      '"Fenster" is neuter',
      '"Das Fenster" - windows are grammatically neuter.'
    ),
    createSentence('a1-46', 'A1', 'She buys shoes.',
      [['Sie', 'subject'], ['kauft', 'verb'], ['Schuhe', 'object']],
      [['kaufen', 'verb'], ['Kleid', 'object']],
      'Verb conjugation',
      '"Kauft" is correct for "sie". "Kaufen" is infinitive.'
    ),
    createSentence('a1-47', 'A1', 'The father reads.',
      [['Der', 'article'], ['Vater', 'subject'], ['liest', 'verb']],
      [['Die', 'article'], ['lesen', 'verb']],
      '"Vater" is masculine',
      '"Der Vater" - fathers are grammatically masculine.'
    ),
    createSentence('a1-48', 'A1', 'I hear music.',
      [['Ich', 'subject'], ['höre', 'verb'], ['Musik', 'object']],
      [['hörst', 'verb'], ['Lied', 'object']],
      'Verb conjugation',
      '"Höre" is correct for "ich". "Hörst" is for "du".'
    ),
    createSentence('a1-49', 'A1', 'The school is big.',
      [['Die', 'article'], ['Schule', 'subject'], ['ist', 'verb'], ['groß', 'adjective']],
      [['Das', 'article'], ['klein', 'adjective']],
      '"Schule" is feminine',
      '"Die Schule" - schools are grammatically feminine.'
    ),
    createSentence('a1-50', 'A1', 'They come soon.',
      [['Sie', 'subject'], ['kommen', 'verb'], ['bald', 'time']],
      [['kommt', 'verb'], ['später', 'time']],
      'Plural verb form',
      '"Kommen" is correct for "sie" (they). "Kommt" is singular.'
    ),
  ],

  A2: [
    // === 50+ A2 Sentences - More complex main clauses with time/place ===
    createSentence('a2-1', 'A2', 'Tomorrow we drive to Berlin.',
      [['Morgen', 'time'], ['fahren', 'verb'], ['wir', 'subject'], ['nach', 'particle'], ['Berlin', 'place']],
      [['fährt', 'verb'], ['in', 'particle']],
      'Time first = verb before subject',
      'When time (Morgen) starts the sentence, the verb stays position 2.'
    ),
    createSentence('a2-2', 'A2', 'I would like to have a coffee.',
      [['Ich', 'subject'], ['möchte', 'verb'], ['einen', 'article'], ['Kaffee', 'object'], ['haben', 'verb']],
      [['möchten', 'verb'], ['ein', 'article']],
      'Modal verb with infinitive',
      '"Möchte" is the conjugated modal, "haben" is infinitive at end.'
    ),
    createSentence('a2-3', 'A2', 'Yesterday I bought a car.',
      [['Gestern', 'time'], ['habe', 'auxiliary'], ['ich', 'subject'], ['ein', 'article'], ['Auto', 'object'], ['gekauft', 'verb']],
      [['haben', 'auxiliary'], ['das', 'article']],
      'Perfect tense structure',
      'Perfect: auxiliary (habe) in position 2, past participle (gekauft) at end.'
    ),
    createSentence('a2-4', 'A2', 'In summer we go swimming.',
      [['Im', 'time'], ['Sommer', 'time'], ['gehen', 'verb'], ['wir', 'subject'], ['schwimmen', 'verb']],
      [['geht', 'verb'], ['Winter', 'time']],
      'Time phrase + infinitive',
      '"Im Sommer" is a time phrase, verb stays position 2.'
    ),
    createSentence('a2-5', 'A2', 'The children play in the park.',
      [['Die', 'article'], ['Kinder', 'subject'], ['spielen', 'verb'], ['im', 'particle'], ['Park', 'place']],
      [['Das', 'article'], ['spielt', 'verb']],
      'Plural subject and verb',
      '"Kinder" is plural, so "spielen" (not "spielt") is correct.'
    ),
    createSentence('a2-6', 'A2', 'I can speak German.',
      [['Ich', 'subject'], ['kann', 'verb'], ['Deutsch', 'object'], ['sprechen', 'verb']],
      [['können', 'verb'], ['spricht', 'verb']],
      'Modal verb structure',
      'Modal (kann) is conjugated, infinitive (sprechen) goes to end.'
    ),
    createSentence('a2-7', 'A2', 'We must go home now.',
      [['Wir', 'subject'], ['müssen', 'verb'], ['jetzt', 'time'], ['nach', 'particle'], ['Hause', 'place'], ['gehen', 'verb']],
      [['muss', 'verb'], ['gehst', 'verb']],
      'Modal verb with "wir"',
      '"Müssen" is correct for "wir". "Muss" is for ich/er/sie/es.'
    ),
    createSentence('a2-8', 'A2', 'He wants to visit his friend.',
      [['Er', 'subject'], ['will', 'verb'], ['seinen', 'article'], ['Freund', 'object'], ['besuchen', 'verb']],
      [['wollen', 'verb'], ['sein', 'article']],
      'Modal + accusative',
      '"Will" is conjugated, "seinen" is accusative masculine.'
    ),
    createSentence('a2-9', 'A2', 'She has to work today.',
      [['Sie', 'subject'], ['muss', 'verb'], ['heute', 'time'], ['arbeiten', 'verb']],
      [['müssen', 'verb'], ['arbeitet', 'verb']],
      'Modal verb "müssen"',
      '"Muss" is correct for "sie". Infinitive "arbeiten" goes to end.'
    ),
    createSentence('a2-10', 'A2', 'We have eaten in the restaurant.',
      [['Wir', 'subject'], ['haben', 'auxiliary'], ['im', 'particle'], ['Restaurant', 'place'], ['gegessen', 'verb']],
      [['hat', 'auxiliary'], ['essen', 'verb']],
      'Perfect tense',
      '"Haben" is auxiliary, "gegessen" is past participle at end.'
    ),
    createSentence('a2-11', 'A2', 'The train arrives at 8.',
      [['Der', 'article'], ['Zug', 'subject'], ['kommt', 'verb'], ['um', 'particle'], ['8', 'time'], ['Uhr', 'time'], ['an', 'particle']],
      [['Die', 'article'], ['kommen', 'verb']],
      'Separable verb "ankommen"',
      '"Ankommen" splits: "kommt" is conjugated, "an" goes to end.'
    ),
    createSentence('a2-12', 'A2', 'I stand up early.',
      [['Ich', 'subject'], ['stehe', 'verb'], ['früh', 'time'], ['auf', 'particle']],
      [['stehst', 'verb'], ['spät', 'time']],
      'Separable verb "aufstehen"',
      '"Aufstehen" splits: "stehe" is conjugated, "auf" goes to end.'
    ),
    createSentence('a2-13', 'A2', 'He calls me tomorrow.',
      [['Er', 'subject'], ['ruft', 'verb'], ['mich', 'object'], ['morgen', 'time'], ['an', 'particle']],
      [['rufen', 'verb'], ['mir', 'object']],
      'Separable verb + accusative',
      '"Anrufen" takes accusative (mich, not mir).'
    ),
    createSentence('a2-14', 'A2', 'The bus arrives soon.',
      [['Der', 'article'], ['Bus', 'subject'], ['kommt', 'verb'], ['bald', 'time'], ['an', 'particle']],
      [['Die', 'article'], ['kommen', 'verb']],
      '"Bus" is masculine',
      '"Der Bus" - buses are grammatically masculine.'
    ),
    createSentence('a2-15', 'A2', 'She goes shopping.',
      [['Sie', 'subject'], ['geht', 'verb'], ['einkaufen', 'verb']],
      [['gehen', 'verb'], ['kaufen', 'verb']],
      'Verb + infinitive',
      '"Einkaufen" (shopping) is the infinitive at the end.'
    ),
    createSentence('a2-16', 'A2', 'We watch a movie this evening.',
      [['Wir', 'subject'], ['sehen', 'verb'], ['heute', 'time'], ['Abend', 'time'], ['einen', 'article'], ['Film', 'object']],
      [['sieht', 'verb'], ['ein', 'article']],
      'Time before object',
      'Time expressions typically come before objects in German.'
    ),
    createSentence('a2-17', 'A2', 'I give him the book.',
      [['Ich', 'subject'], ['gebe', 'verb'], ['ihm', 'object'], ['das', 'article'], ['Buch', 'object']],
      [['gibst', 'verb'], ['ihn', 'object']],
      'Dative + Accusative',
      '"Ihm" is dative (to him), "das Buch" is accusative (direct object).'
    ),
    createSentence('a2-18', 'A2', 'The hotel is near the station.',
      [['Das', 'article'], ['Hotel', 'subject'], ['ist', 'verb'], ['neben', 'particle'], ['dem', 'article'], ['Bahnhof', 'place']],
      [['Der', 'article'], ['den', 'article']],
      'Dative with "neben"',
      '"Neben" with location = dative: "dem Bahnhof".'
    ),
    createSentence('a2-19', 'A2', 'She reads the newspaper every day.',
      [['Sie', 'subject'], ['liest', 'verb'], ['jeden', 'time'], ['Tag', 'time'], ['die', 'article'], ['Zeitung', 'object']],
      [['lesen', 'verb'], ['der', 'article']],
      'Time expression + object',
      '"Jeden Tag" (every day) comes before the direct object.'
    ),
    createSentence('a2-20', 'A2', 'We meet at 3 oclock.',
      [['Wir', 'subject'], ['treffen', 'verb'], ['uns', 'object'], ['um', 'particle'], ['3', 'time'], ['Uhr', 'time']],
      [['trifft', 'verb'], ['euch', 'object']],
      'Reflexive verb',
      '"Uns" is the reflexive pronoun for "wir treffen".'
    ),
    createSentence('a2-21', 'A2', 'He helps me with homework.',
      [['Er', 'subject'], ['hilft', 'verb'], ['mir', 'object'], ['bei', 'particle'], ['den', 'article'], ['Hausaufgaben', 'object']],
      [['helfen', 'verb'], ['mich', 'object']],
      '"Helfen" takes dative',
      '"Mir" not "mich" - "helfen" always requires dative.'
    ),
    createSentence('a2-22', 'A2', 'The shop opens at 9.',
      [['Das', 'article'], ['Geschäft', 'subject'], ['öffnet', 'verb'], ['um', 'particle'], ['9', 'time'], ['Uhr', 'time']],
      [['Der', 'article'], ['öffnen', 'verb']],
      '"Geschäft" is neuter',
      '"Das Geschäft" - shops are grammatically neuter.'
    ),
    createSentence('a2-23', 'A2', 'I have been waiting for an hour.',
      [['Ich', 'subject'], ['warte', 'verb'], ['seit', 'particle'], ['einer', 'article'], ['Stunde', 'time']],
      [['wartest', 'verb'], ['einem', 'article']],
      '"Seit" with present tense',
      'German uses present tense with "seit" for ongoing actions.'
    ),
    createSentence('a2-24', 'A2', 'She speaks with her mother.',
      [['Sie', 'subject'], ['spricht', 'verb'], ['mit', 'particle'], ['ihrer', 'article'], ['Mutter', 'object']],
      [['sprechen', 'verb'], ['ihrem', 'article']],
      '"Mit" takes dative',
      '"Ihrer" is dative feminine for possession.'
    ),
    createSentence('a2-25', 'A2', 'We go to the cinema.',
      [['Wir', 'subject'], ['gehen', 'verb'], ['ins', 'particle'], ['Kino', 'place']],
      [['geht', 'verb'], ['im', 'particle']],
      'Movement = accusative',
      '"Ins" (in das) is accusative - movement towards.'
    ),
    createSentence('a2-26', 'A2', 'The food tastes good.',
      [['Das', 'article'], ['Essen', 'subject'], ['schmeckt', 'verb'], ['gut', 'adjective']],
      [['Der', 'article'], ['schmecken', 'verb']],
      '"Essen" is neuter',
      '"Das Essen" - food/meal is grammatically neuter.'
    ),
    createSentence('a2-27', 'A2', 'I am looking for my keys.',
      [['Ich', 'subject'], ['suche', 'verb'], ['meine', 'article'], ['Schlüssel', 'object']],
      [['suchst', 'verb'], ['meinen', 'article']],
      'Plural accusative',
      '"Meine" for plural accusative (Schlüssel is plural here).'
    ),
    createSentence('a2-28', 'A2', 'He arrives at the airport.',
      [['Er', 'subject'], ['kommt', 'verb'], ['am', 'particle'], ['Flughafen', 'place'], ['an', 'particle']],
      [['kommen', 'verb'], ['im', 'particle']],
      'Separable verb',
      '"Ankommen" splits: conjugated verb + "an" at end.'
    ),
    createSentence('a2-29', 'A2', 'The doctor examines the patient.',
      [['Der', 'article'], ['Arzt', 'subject'], ['untersucht', 'verb'], ['den', 'article'], ['Patienten', 'object']],
      [['Die', 'article'], ['dem', 'article']],
      'Weak noun declension',
      '"Patienten" is a weak masculine noun - adds -en in accusative.'
    ),
    createSentence('a2-30', 'A2', 'We travel by train.',
      [['Wir', 'subject'], ['fahren', 'verb'], ['mit', 'particle'], ['dem', 'article'], ['Zug', 'object']],
      [['fährt', 'verb'], ['den', 'article']],
      '"Mit" takes dative',
      '"Mit dem Zug" - "mit" requires dative case.'
    ),
    createSentence('a2-31', 'A2', 'She puts the book on the table.',
      [['Sie', 'subject'], ['legt', 'verb'], ['das', 'article'], ['Buch', 'object'], ['auf', 'particle'], ['den', 'article'], ['Tisch', 'place']],
      [['legen', 'verb'], ['dem', 'article']],
      'Movement = accusative',
      '"Auf den Tisch" - movement uses accusative.'
    ),
    createSentence('a2-32', 'A2', 'I am interested in art.',
      [['Ich', 'subject'], ['interessiere', 'verb'], ['mich', 'object'], ['für', 'particle'], ['Kunst', 'object']],
      [['interessiert', 'verb'], ['mir', 'object']],
      'Reflexive + für',
      '"Sich interessieren für" - reflexive verb with "für".'
    ),
    createSentence('a2-33', 'A2', 'The lesson begins soon.',
      [['Der', 'article'], ['Unterricht', 'subject'], ['beginnt', 'verb'], ['bald', 'time']],
      [['Die', 'article'], ['beginnen', 'verb']],
      '"Unterricht" is masculine',
      '"Der Unterricht" - lesson/class is grammatically masculine.'
    ),
    createSentence('a2-34', 'A2', 'We celebrate my birthday.',
      [['Wir', 'subject'], ['feiern', 'verb'], ['meinen', 'article'], ['Geburtstag', 'object']],
      [['feiert', 'verb'], ['mein', 'article']],
      'Accusative masculine',
      '"Meinen" is accusative masculine (Geburtstag).'
    ),
    createSentence('a2-35', 'A2', 'She waits for the bus.',
      [['Sie', 'subject'], ['wartet', 'verb'], ['auf', 'particle'], ['den', 'article'], ['Bus', 'object']],
      [['warten', 'verb'], ['dem', 'article']],
      '"Warten auf" + accusative',
      '"Warten auf" takes accusative when waiting FOR something.'
    ),
    createSentence('a2-36', 'A2', 'I remember the trip.',
      [['Ich', 'subject'], ['erinnere', 'verb'], ['mich', 'object'], ['an', 'particle'], ['die', 'article'], ['Reise', 'object']],
      [['erinnerst', 'verb'], ['der', 'article']],
      '"Sich erinnern an" + acc',
      '"An" takes accusative with "erinnern".'
    ),
    createSentence('a2-37', 'A2', 'The package arrives tomorrow.',
      [['Das', 'article'], ['Paket', 'subject'], ['kommt', 'verb'], ['morgen', 'time'], ['an', 'particle']],
      [['Der', 'article'], ['kommen', 'verb']],
      '"Paket" is neuter',
      '"Das Paket" - packages are grammatically neuter.'
    ),
    createSentence('a2-38', 'A2', 'He thanks the woman.',
      [['Er', 'subject'], ['dankt', 'verb'], ['der', 'article'], ['Frau', 'object']],
      [['danken', 'verb'], ['die', 'article']],
      '"Danken" takes dative',
      '"Danken" requires dative: "der Frau" not "die Frau".'
    ),
    createSentence('a2-39', 'A2', 'We go out this evening.',
      [['Wir', 'subject'], ['gehen', 'verb'], ['heute', 'time'], ['Abend', 'time'], ['aus', 'particle']],
      [['geht', 'verb'], ['morgen', 'time']],
      'Separable verb "ausgehen"',
      '"Ausgehen" splits: "gehen...aus".'
    ),
    createSentence('a2-40', 'A2', 'She puts on her jacket.',
      [['Sie', 'subject'], ['zieht', 'verb'], ['ihre', 'article'], ['Jacke', 'object'], ['an', 'particle']],
      [['ziehen', 'verb'], ['ihr', 'article']],
      'Separable verb "anziehen"',
      '"Anziehen" splits: "zieht...an".'
    ),
    createSentence('a2-41', 'A2', 'I bring you something.',
      [['Ich', 'subject'], ['bringe', 'verb'], ['dir', 'object'], ['etwas', 'object'], ['mit', 'particle']],
      [['bringst', 'verb'], ['dich', 'object']],
      'Dative person + accusative thing',
      '"Dir" (dative) is the person, "etwas" is what is brought.'
    ),
    createSentence('a2-42', 'A2', 'The exam takes two hours.',
      [['Die', 'article'], ['Prüfung', 'subject'], ['dauert', 'verb'], ['zwei', 'object'], ['Stunden', 'time']],
      [['Der', 'article'], ['dauern', 'verb']],
      '"Prüfung" is feminine',
      '"Die Prüfung" - exams are grammatically feminine.'
    ),
    createSentence('a2-43', 'A2', 'He forgets his wallet.',
      [['Er', 'subject'], ['vergisst', 'verb'], ['sein', 'article'], ['Portemonnaie', 'object']],
      [['vergessen', 'verb'], ['seinen', 'article']],
      'Nominative possession',
      '"Sein" is nominative/accusative neuter (Portemonnaie is neuter).'
    ),
    createSentence('a2-44', 'A2', 'We practice German every day.',
      [['Wir', 'subject'], ['üben', 'verb'], ['jeden', 'time'], ['Tag', 'time'], ['Deutsch', 'object']],
      [['übt', 'verb'], ['jede', 'time']],
      'Accusative time expression',
      '"Jeden Tag" is accusative (Akk. der Zeit).'
    ),
    createSentence('a2-45', 'A2', 'The apartment is on the third floor.',
      [['Die', 'article'], ['Wohnung', 'subject'], ['ist', 'verb'], ['im', 'particle'], ['dritten', 'adjective'], ['Stock', 'place']],
      [['Das', 'article'], ['dritte', 'adjective']],
      'Dative with location',
      '"Im dritten Stock" - location uses dative.'
    ),
    createSentence('a2-46', 'A2', 'She thinks about the problem.',
      [['Sie', 'subject'], ['denkt', 'verb'], ['an', 'particle'], ['das', 'article'], ['Problem', 'object'], ['nach', 'particle']],
      [['denken', 'verb'], ['dem', 'article']],
      'Separable verb + preposition',
      '"Nachdenken über/an" is a separable verb.'
    ),
    createSentence('a2-47', 'A2', 'I understand you well.',
      [['Ich', 'subject'], ['verstehe', 'verb'], ['dich', 'object'], ['gut', 'adjective']],
      [['verstehst', 'verb'], ['dir', 'object']],
      'Accusative object',
      '"Verstehen" takes accusative: "dich" not "dir".'
    ),
    createSentence('a2-48', 'A2', 'The market opens early.',
      [['Der', 'article'], ['Markt', 'subject'], ['öffnet', 'verb'], ['früh', 'time']],
      [['Die', 'article'], ['öffnen', 'verb']],
      '"Markt" is masculine',
      '"Der Markt" - markets are grammatically masculine.'
    ),
    createSentence('a2-49', 'A2', 'We have a reservation.',
      [['Wir', 'subject'], ['haben', 'verb'], ['eine', 'article'], ['Reservierung', 'object']],
      [['hat', 'verb'], ['ein', 'article']],
      '"Reservierung" is feminine',
      '"Eine Reservierung" - -ung ending = feminine.'
    ),
    createSentence('a2-50', 'A2', 'He tells me a story.',
      [['Er', 'subject'], ['erzählt', 'verb'], ['mir', 'object'], ['eine', 'article'], ['Geschichte', 'object']],
      [['erzählen', 'verb'], ['mich', 'object']],
      'Dative + Accusative',
      '"Mir" (dative) receives, "eine Geschichte" (acc) is told.'
    ),
  ],

  B1: [
    // === 50+ B1 Sentences - Subordinate clauses, verb at end ===
    createSentence('b1-1', 'B1', 'I know that he is coming.',
      [['Ich', 'subject'], ['weiß', 'verb'], ['dass', 'conjunction'], ['er', 'subject'], ['kommt', 'verb']],
      [['wissen', 'verb'], ['weil', 'conjunction']],
      '"Dass" sends verb to end',
      'In "dass" clauses, the conjugated verb moves to the end.'
    ),
    createSentence('b1-2', 'B1', 'Because he is tired, he sleeps.',
      [['Weil', 'conjunction'], ['er', 'subject'], ['müde', 'adjective'], ['ist', 'verb'], ['schläft', 'verb'], ['er', 'subject']],
      [['Dass', 'conjunction'], ['sind', 'verb']],
      'Weil-clause + main clause',
      '"Weil" subordinate clause comes first, then main clause with verb-subject.'
    ),
    createSentence('b1-3', 'B1', 'I think that it is good.',
      [['Ich', 'subject'], ['denke', 'verb'], ['dass', 'conjunction'], ['es', 'subject'], ['gut', 'adjective'], ['ist', 'verb']],
      [['denkst', 'verb'], ['ob', 'conjunction']],
      '"Dass" clause structure',
      'After "dass", the verb goes to the end of the clause.'
    ),
    createSentence('b1-4', 'B1', 'Although she is sick, she works.',
      [['Obwohl', 'conjunction'], ['sie', 'subject'], ['krank', 'adjective'], ['ist', 'verb'], ['arbeitet', 'verb'], ['sie', 'subject']],
      [['Wenn', 'conjunction'], ['sind', 'verb']],
      '"Obwohl" subordinate clause',
      '"Obwohl" (although) sends verb to end, main clause follows.'
    ),
    createSentence('b1-5', 'B1', 'When I come home, I eat.',
      [['Wenn', 'conjunction'], ['ich', 'subject'], ['nach', 'particle'], ['Hause', 'place'], ['komme', 'verb'], ['esse', 'verb'], ['ich', 'subject']],
      [['Weil', 'conjunction'], ['kommen', 'verb']],
      '"Wenn" clause structure',
      '"Wenn" (when/if) is a subordinating conjunction.'
    ),
    createSentence('b1-6', 'B1', 'I hope that you are well.',
      [['Ich', 'subject'], ['hoffe', 'verb'], ['dass', 'conjunction'], ['es', 'subject'], ['dir', 'object'], ['gut', 'adjective'], ['geht', 'verb']],
      [['hoffst', 'verb'], ['dich', 'object']],
      '"Gehen" with dative',
      '"Es geht dir gut" - "gehen" uses dative (dir).'
    ),
    createSentence('b1-7', 'B1', 'He says that he has no time.',
      [['Er', 'subject'], ['sagt', 'verb'], ['dass', 'conjunction'], ['er', 'subject'], ['keine', 'article'], ['Zeit', 'object'], ['hat', 'verb']],
      [['sagen', 'verb'], ['kein', 'article']],
      '"Dass" clause with negation',
      '"Keine" is feminine accusative (Zeit is feminine).'
    ),
    createSentence('b1-8', 'B1', 'Since I live here, I feel good.',
      [['Seitdem', 'conjunction'], ['ich', 'subject'], ['hier', 'place'], ['wohne', 'verb'], ['fühle', 'verb'], ['ich', 'subject'], ['mich', 'object'], ['gut', 'adjective']],
      [['Weil', 'conjunction'], ['wohnst', 'verb']],
      '"Seitdem" subordinate clause',
      '"Seitdem" (since) sends verb to end of its clause.'
    ),
    createSentence('b1-9', 'B1', 'I dont know if he comes.',
      [['Ich', 'subject'], ['weiß', 'verb'], ['nicht', 'particle'], ['ob', 'conjunction'], ['er', 'subject'], ['kommt', 'verb']],
      [['wissen', 'verb'], ['dass', 'conjunction']],
      '"Ob" in indirect questions',
      '"Ob" (whether/if) introduces indirect yes/no questions.'
    ),
    createSentence('b1-10', 'B1', 'Before I leave, I call you.',
      [['Bevor', 'conjunction'], ['ich', 'subject'], ['gehe', 'verb'], ['rufe', 'verb'], ['ich', 'subject'], ['dich', 'object'], ['an', 'particle']],
      [['Nachdem', 'conjunction'], ['gehst', 'verb']],
      '"Bevor" subordinate clause',
      '"Bevor" (before) is a subordinating conjunction.'
    ),
    createSentence('b1-11', 'B1', 'After he ate, he left.',
      [['Nachdem', 'conjunction'], ['er', 'subject'], ['gegessen', 'verb'], ['hatte', 'auxiliary'], ['ging', 'verb'], ['er', 'subject']],
      [['Bevor', 'conjunction'], ['hat', 'auxiliary']],
      '"Nachdem" with past perfect',
      '"Nachdem" often uses past perfect for completed action.'
    ),
    createSentence('b1-12', 'B1', 'While I work, he watches TV.',
      [['Während', 'conjunction'], ['ich', 'subject'], ['arbeite', 'verb'], ['sieht', 'verb'], ['er', 'subject'], ['fern', 'particle']],
      [['Weil', 'conjunction'], ['arbeitest', 'verb']],
      '"Während" subordinate clause',
      '"Während" (while) creates simultaneous action.'
    ),
    createSentence('b1-13', 'B1', 'The man who lives here is nice.',
      [['Der', 'article'], ['Mann', 'subject'], ['der', 'conjunction'], ['hier', 'place'], ['wohnt', 'verb'], ['ist', 'verb'], ['nett', 'adjective']],
      [['Die', 'article'], ['wohnen', 'verb']],
      'Relative clause',
      'Relative pronoun "der" refers back to "der Mann".'
    ),
    createSentence('b1-14', 'B1', 'I ask myself why he doesnt come.',
      [['Ich', 'subject'], ['frage', 'verb'], ['mich', 'object'], ['warum', 'conjunction'], ['er', 'subject'], ['nicht', 'particle'], ['kommt', 'verb']],
      [['fragst', 'verb'], ['dich', 'object']],
      'Indirect question with "warum"',
      '"Warum" is a W-word that creates subordinate clause.'
    ),
    createSentence('b1-15', 'B1', 'So that I can sleep, I drink tea.',
      [['Damit', 'conjunction'], ['ich', 'subject'], ['schlafen', 'verb'], ['kann', 'auxiliary'], ['trinke', 'verb'], ['ich', 'subject'], ['Tee', 'object']],
      [['Weil', 'conjunction'], ['kannst', 'auxiliary']],
      '"Damit" for purpose',
      '"Damit" (so that) expresses purpose, verb goes to end.'
    ),
    createSentence('b1-16', 'B1', 'Unless you help, I cannot finish.',
      [['Wenn', 'conjunction'], ['du', 'subject'], ['nicht', 'particle'], ['hilfst', 'verb'], ['kann', 'auxiliary'], ['ich', 'subject'], ['nicht', 'particle'], ['fertig', 'adjective'], ['werden', 'verb']],
      [['Weil', 'conjunction'], ['helfen', 'verb']],
      'Conditional with negation',
      '"Wenn...nicht" expresses "unless".'
    ),
    createSentence('b1-17', 'B1', 'I believe that he is right.',
      [['Ich', 'subject'], ['glaube', 'verb'], ['dass', 'conjunction'], ['er', 'subject'], ['Recht', 'object'], ['hat', 'verb']],
      [['glaubst', 'verb'], ['weil', 'conjunction']],
      '"Dass" clause',
      '"Recht haben" is an idiom: "to be right".'
    ),
    createSentence('b1-18', 'B1', 'She explains how it works.',
      [['Sie', 'subject'], ['erklärt', 'verb'], ['wie', 'conjunction'], ['es', 'subject'], ['funktioniert', 'verb']],
      [['erklären', 'verb'], ['was', 'conjunction']],
      'Indirect question with "wie"',
      '"Wie" introduces an indirect question.'
    ),
    createSentence('b1-19', 'B1', 'Even though I tried, I failed.',
      [['Obwohl', 'conjunction'], ['ich', 'subject'], ['es', 'object'], ['versucht', 'verb'], ['habe', 'auxiliary'], ['habe', 'auxiliary'], ['ich', 'subject'], ['versagt', 'verb']],
      [['Weil', 'conjunction'], ['versuchen', 'verb']],
      'Concessive clause',
      '"Obwohl" introduces concession despite the effort.'
    ),
    createSentence('b1-20', 'B1', 'As soon as he arrives, we start.',
      [['Sobald', 'conjunction'], ['er', 'subject'], ['ankommt', 'verb'], ['fangen', 'verb'], ['wir', 'subject'], ['an', 'particle']],
      [['Wenn', 'conjunction'], ['ankommen', 'verb']],
      '"Sobald" subordinate clause',
      '"Sobald" (as soon as) is temporal conjunction.'
    ),
    createSentence('b1-21', 'B1', 'I wonder what he means.',
      [['Ich', 'subject'], ['frage', 'verb'], ['mich', 'object'], ['was', 'conjunction'], ['er', 'subject'], ['meint', 'verb']],
      [['fragst', 'verb'], ['wie', 'conjunction']],
      'Indirect question',
      '"Was" introduces an indirect question.'
    ),
    createSentence('b1-22', 'B1', 'The book that I bought is good.',
      [['Das', 'article'], ['Buch', 'subject'], ['das', 'conjunction'], ['ich', 'subject'], ['gekauft', 'verb'], ['habe', 'auxiliary'], ['ist', 'verb'], ['gut', 'adjective']],
      [['Der', 'article'], ['kaufen', 'verb']],
      'Relative clause with past',
      '"Das" as relative pronoun for neuter "Buch".'
    ),
    createSentence('b1-23', 'B1', 'He acts as if he knew everything.',
      [['Er', 'subject'], ['tut', 'verb'], ['so', 'particle'], ['als', 'conjunction'], ['ob', 'conjunction'], ['er', 'subject'], ['alles', 'object'], ['wüsste', 'verb']],
      [['tun', 'verb'], ['weil', 'conjunction']],
      'Subjunctive II',
      '"Als ob" + Konjunktiv II for unreal comparison.'
    ),
    createSentence('b1-24', 'B1', 'I am happy that you came.',
      [['Ich', 'subject'], ['freue', 'verb'], ['mich', 'object'], ['dass', 'conjunction'], ['du', 'subject'], ['gekommen', 'verb'], ['bist', 'auxiliary']],
      [['freust', 'verb'], ['weil', 'conjunction']],
      'Perfect in "dass" clause',
      'Perfect tense in subordinate clause: participle before auxiliary.'
    ),
    createSentence('b1-25', 'B1', 'Wherever you go, I follow.',
      [['Wohin', 'conjunction'], ['du', 'subject'], ['auch', 'particle'], ['gehst', 'verb'], ['folge', 'verb'], ['ich', 'subject'], ['dir', 'object']],
      [['Weil', 'conjunction'], ['gehen', 'verb']],
      '"Wohin" clause',
      '"Wohin" (wherever) creates subordinate clause.'
    ),
    createSentence('b1-26', 'B1', 'Instead of working, he plays.',
      [['Anstatt', 'conjunction'], ['zu', 'particle'], ['arbeiten', 'verb'], ['spielt', 'verb'], ['er', 'subject']],
      [['Weil', 'conjunction'], ['arbeitest', 'verb']],
      '"Anstatt zu" infinitive',
      '"Anstatt zu" (instead of) takes infinitive.'
    ),
    createSentence('b1-27', 'B1', 'I called so that you would know.',
      [['Ich', 'subject'], ['habe', 'auxiliary'], ['angerufen', 'verb'], ['damit', 'conjunction'], ['du', 'subject'], ['Bescheid', 'object'], ['weißt', 'verb']],
      [['hast', 'auxiliary'], ['weil', 'conjunction']],
      '"Damit" purpose clause',
      '"Damit" (so that) creates purpose clause.'
    ),
    createSentence('b1-28', 'B1', 'The more I learn, the more I understand.',
      [['Je', 'conjunction'], ['mehr', 'adjective'], ['ich', 'subject'], ['lerne', 'verb'], ['desto', 'conjunction'], ['mehr', 'adjective'], ['verstehe', 'verb'], ['ich', 'subject']],
      [['Weil', 'conjunction'], ['lernst', 'verb']],
      '"Je...desto" construction',
      '"Je...desto" (the more...the more) comparative structure.'
    ),
    createSentence('b1-29', 'B1', 'She asked where I live.',
      [['Sie', 'subject'], ['fragte', 'verb'], ['wo', 'conjunction'], ['ich', 'subject'], ['wohne', 'verb']],
      [['fragen', 'verb'], ['weil', 'conjunction']],
      'Indirect question with "wo"',
      '"Wo" (where) creates subordinate clause.'
    ),
    createSentence('b1-30', 'B1', 'Without you helping, I cannot do it.',
      [['Ohne', 'conjunction'], ['dass', 'conjunction'], ['du', 'subject'], ['hilfst', 'verb'], ['kann', 'auxiliary'], ['ich', 'subject'], ['es', 'object'], ['nicht', 'particle'], ['machen', 'verb']],
      [['Mit', 'conjunction'], ['helfen', 'verb']],
      '"Ohne dass" clause',
      '"Ohne dass" (without) is a conjunction combination.'
    ),
    createSentence('b1-31', 'B1', 'He studies in order to pass.',
      [['Er', 'subject'], ['lernt', 'verb'], ['um', 'conjunction'], ['zu', 'particle'], ['bestehen', 'verb']],
      [['lernen', 'verb'], ['weil', 'conjunction']],
      '"Um zu" infinitive',
      '"Um zu" (in order to) introduces purpose infinitive.'
    ),
    createSentence('b1-32', 'B1', 'The reason why I called is important.',
      [['Der', 'article'], ['Grund', 'subject'], ['warum', 'conjunction'], ['ich', 'subject'], ['angerufen', 'verb'], ['habe', 'auxiliary'], ['ist', 'verb'], ['wichtig', 'adjective']],
      [['Die', 'article'], ['weil', 'conjunction']],
      'Relative clause with "warum"',
      '"Warum" creates embedded clause explaining reason.'
    ),
    createSentence('b1-33', 'B1', 'I eat breakfast before I go.',
      [['Ich', 'subject'], ['frühstücke', 'verb'], ['bevor', 'conjunction'], ['ich', 'subject'], ['gehe', 'verb']],
      [['frühstücken', 'verb'], ['nachdem', 'conjunction']],
      '"Bevor" time clause',
      '"Bevor" (before) is temporal subordinating conjunction.'
    ),
    createSentence('b1-34', 'B1', 'She is older than I thought.',
      [['Sie', 'subject'], ['ist', 'verb'], ['älter', 'adjective'], ['als', 'conjunction'], ['ich', 'subject'], ['dachte', 'verb']],
      [['sind', 'verb'], ['denken', 'verb']],
      'Comparative + "als" clause',
      '"Als" (than) introduces comparison clause.'
    ),
    createSentence('b1-35', 'B1', 'Whatever happens, I stay.',
      [['Was', 'conjunction'], ['auch', 'particle'], ['passiert', 'verb'], ['ich', 'subject'], ['bleibe', 'verb']],
      [['Weil', 'conjunction'], ['passieren', 'verb']],
      '"Was auch" concessive',
      '"Was auch" (whatever) creates concessive clause.'
    ),
    createSentence('b1-36', 'B1', 'I told him that he should wait.',
      [['Ich', 'subject'], ['sagte', 'verb'], ['ihm', 'object'], ['dass', 'conjunction'], ['er', 'subject'], ['warten', 'verb'], ['soll', 'auxiliary']],
      [['sagen', 'verb'], ['ihn', 'object']],
      'Modal in "dass" clause',
      '"Soll" (should) is modal verb, infinitive at end.'
    ),
    createSentence('b1-37', 'B1', 'Once you understand, it is easy.',
      [['Sobald', 'conjunction'], ['du', 'subject'], ['verstehst', 'verb'], ['ist', 'verb'], ['es', 'subject'], ['einfach', 'adjective']],
      [['Weil', 'conjunction'], ['verstehen', 'verb']],
      '"Sobald" condition',
      '"Sobald" (once/as soon as) temporal conjunction.'
    ),
    createSentence('b1-38', 'B1', 'I regret that I said that.',
      [['Ich', 'subject'], ['bereue', 'verb'], ['dass', 'conjunction'], ['ich', 'subject'], ['das', 'object'], ['gesagt', 'verb'], ['habe', 'auxiliary']],
      [['bereuest', 'verb'], ['weil', 'conjunction']],
      'Perfect in subordinate',
      'Perfect tense: participle before auxiliary in clause.'
    ),
    createSentence('b1-39', 'B1', 'It depends on how much time we have.',
      [['Es', 'subject'], ['kommt', 'verb'], ['darauf', 'particle'], ['an', 'particle'], ['wie', 'conjunction'], ['viel', 'adjective'], ['Zeit', 'object'], ['wir', 'subject'], ['haben', 'verb']],
      [['kommen', 'verb'], ['was', 'conjunction']],
      '"Ankommen auf" + clause',
      '"Es kommt darauf an" + "wie" clause for dependency.'
    ),
    createSentence('b1-40', 'B1', 'The longer I wait, the more nervous I get.',
      [['Je', 'conjunction'], ['länger', 'adjective'], ['ich', 'subject'], ['warte', 'verb'], ['desto', 'conjunction'], ['nervöser', 'adjective'], ['werde', 'verb'], ['ich', 'subject']],
      [['Weil', 'conjunction'], ['wartest', 'verb']],
      '"Je...desto" structure',
      'Correlative comparative: "Je...desto".'
    ),
    createSentence('b1-41', 'B1', 'Given that it rains, we stay home.',
      [['Da', 'conjunction'], ['es', 'subject'], ['regnet', 'verb'], ['bleiben', 'verb'], ['wir', 'subject'], ['zu', 'particle'], ['Hause', 'place']],
      [['Weil', 'conjunction'], ['regnen', 'verb']],
      '"Da" causal clause',
      '"Da" (since/given that) is subordinating conjunction.'
    ),
    createSentence('b1-42', 'B1', 'I do not know who called.',
      [['Ich', 'subject'], ['weiß', 'verb'], ['nicht', 'particle'], ['wer', 'conjunction'], ['angerufen', 'verb'], ['hat', 'auxiliary']],
      [['wissen', 'verb'], ['was', 'conjunction']],
      'Indirect question "wer"',
      '"Wer" (who) creates indirect question.'
    ),
    createSentence('b1-43', 'B1', 'They explained what happened.',
      [['Sie', 'subject'], ['erklärten', 'verb'], ['was', 'conjunction'], ['passiert', 'verb'], ['ist', 'auxiliary']],
      [['erklären', 'verb'], ['weil', 'conjunction']],
      'Indirect question "was"',
      '"Was" introduces what-clause with verb at end.'
    ),
    createSentence('b1-44', 'B1', 'If only I had more money!',
      [['Wenn', 'conjunction'], ['ich', 'subject'], ['doch', 'particle'], ['nur', 'particle'], ['mehr', 'adjective'], ['Geld', 'object'], ['hätte', 'verb']],
      [['Weil', 'conjunction'], ['haben', 'verb']],
      'Subjunctive wish',
      '"Wenn...doch nur" expresses unfulfilled wish.'
    ),
    createSentence('b1-45', 'B1', 'Whether he comes or not, we start.',
      [['Ob', 'conjunction'], ['er', 'subject'], ['kommt', 'verb'], ['oder', 'conjunction'], ['nicht', 'particle'], ['wir', 'subject'], ['fangen', 'verb'], ['an', 'particle']],
      [['Dass', 'conjunction'], ['kommen', 'verb']],
      '"Ob...oder nicht"',
      '"Ob...oder nicht" (whether...or not) structure.'
    ),
    createSentence('b1-46', 'B1', 'I doubt that it will work.',
      [['Ich', 'subject'], ['bezweifle', 'verb'], ['dass', 'conjunction'], ['es', 'subject'], ['funktionieren', 'verb'], ['wird', 'auxiliary']],
      [['bezweifeln', 'verb'], ['ob', 'conjunction']],
      'Future in subordinate',
      'Future: "wird" auxiliary at end after infinitive.'
    ),
    createSentence('b1-47', 'B1', 'Until he comes, I read.',
      [['Bis', 'conjunction'], ['er', 'subject'], ['kommt', 'verb'], ['lese', 'verb'], ['ich', 'subject']],
      [['Weil', 'conjunction'], ['kommen', 'verb']],
      '"Bis" temporal clause',
      '"Bis" (until) is subordinating conjunction.'
    ),
    createSentence('b1-48', 'B1', 'However I try, I fail.',
      [['Wie', 'conjunction'], ['ich', 'subject'], ['es', 'object'], ['auch', 'particle'], ['versuche', 'verb'], ['scheitere', 'verb'], ['ich', 'subject']],
      [['Weil', 'conjunction'], ['versuchen', 'verb']],
      'Concessive "wie...auch"',
      '"Wie...auch" (however) expresses concession.'
    ),
    createSentence('b1-49', 'B1', 'I am surprised that you are here.',
      [['Ich', 'subject'], ['bin', 'verb'], ['überrascht', 'adjective'], ['dass', 'conjunction'], ['du', 'subject'], ['hier', 'place'], ['bist', 'verb']],
      [['bist', 'verb'], ['weil', 'conjunction']],
      '"Überrascht + dass"',
      'Adjective + "dass" clause expression.'
    ),
    createSentence('b1-50', 'B1', 'Provided that you agree, we proceed.',
      [['Vorausgesetzt', 'conjunction'], ['dass', 'conjunction'], ['du', 'subject'], ['zustimmst', 'verb'], ['machen', 'verb'], ['wir', 'subject'], ['weiter', 'particle']],
      [['Weil', 'conjunction'], ['zustimmen', 'verb']],
      '"Vorausgesetzt dass"',
      '"Vorausgesetzt dass" (provided that) conditional.'
    ),
  ],

  B2: [
    // === 40+ B2 Sentences - Complex subordinate clauses ===
    createSentence('b2-1', 'B2', 'If I had more time, I would read more.',
      [['Wenn', 'conjunction'], ['ich', 'subject'], ['mehr', 'adjective'], ['Zeit', 'object'], ['hätte', 'verb'], ['würde', 'auxiliary'], ['ich', 'subject'], ['mehr', 'adjective'], ['lesen', 'verb']],
      [['Weil', 'conjunction'], ['haben', 'verb']],
      'Konjunktiv II conditional',
      '"Hätte...würde" expresses unreal/hypothetical condition.'
    ),
    createSentence('b2-2', 'B2', 'The book that I read was interesting.',
      [['Das', 'article'], ['Buch', 'subject'], ['das', 'conjunction'], ['ich', 'subject'], ['gelesen', 'verb'], ['habe', 'auxiliary'], ['war', 'verb'], ['interessant', 'adjective']],
      [['Der', 'article'], ['lesen', 'verb']],
      'Relative clause with perfect',
      'Relative clause uses perfect: participle + auxiliary at end.'
    ),
    createSentence('b2-3', 'B2', 'Although it was raining, we went out.',
      [['Obwohl', 'conjunction'], ['es', 'subject'], ['geregnet', 'verb'], ['hat', 'auxiliary'], ['sind', 'auxiliary'], ['wir', 'subject'], ['ausgegangen', 'verb']],
      [['Weil', 'conjunction'], ['regnen', 'verb']],
      'Concessive with perfect',
      '"Obwohl" + perfect in both clauses.'
    ),
    createSentence('b2-4', 'B2', 'I wonder whether he comes.',
      [['Ich', 'subject'], ['frage', 'verb'], ['mich', 'object'], ['ob', 'conjunction'], ['er', 'subject'], ['kommt', 'verb']],
      [['fragst', 'verb'], ['dass', 'conjunction']],
      'Indirect yes/no question',
      '"Ob" for indirect yes/no questions.'
    ),
    createSentence('b2-5', 'B2', 'Had I known, I would have helped.',
      [['Hätte', 'auxiliary'], ['ich', 'subject'], ['es', 'object'], ['gewusst', 'verb'], ['hätte', 'auxiliary'], ['ich', 'subject'], ['geholfen', 'verb']],
      [['Haben', 'auxiliary'], ['wissen', 'verb']],
      'Past subjunctive',
      'Konjunktiv II Plusquamperfekt: "Hätte...gewusst".'
    ),
    createSentence('b2-6', 'B2', 'The way things are developing, I am concerned.',
      [['So', 'particle'], ['wie', 'conjunction'], ['sich', 'object'], ['die', 'article'], ['Dinge', 'subject'], ['entwickeln', 'verb'], ['mache', 'verb'], ['ich', 'subject'], ['mir', 'object'], ['Sorgen', 'object']],
      [['Weil', 'conjunction'], ['entwickelt', 'verb']],
      'Complex relative structure',
      '"So wie" (the way) introduces manner clause.'
    ),
    createSentence('b2-7', 'B2', 'No matter what you say, I will not change my mind.',
      [['Was', 'conjunction'], ['du', 'subject'], ['auch', 'particle'], ['sagst', 'verb'], ['ich', 'subject'], ['werde', 'auxiliary'], ['meine', 'article'], ['Meinung', 'object'], ['nicht', 'particle'], ['ändern', 'verb']],
      [['Weil', 'conjunction'], ['sagen', 'verb']],
      'Concessive with "was...auch"',
      '"Was...auch" (no matter what) concessive structure.'
    ),
    createSentence('b2-8', 'B2', 'Assuming that is true, we have a problem.',
      [['Angenommen', 'conjunction'], ['das', 'subject'], ['stimmt', 'verb'], ['haben', 'verb'], ['wir', 'subject'], ['ein', 'article'], ['Problem', 'object']],
      [['Weil', 'conjunction'], ['stimmen', 'verb']],
      '"Angenommen" conditional',
      '"Angenommen" (assuming) introduces conditional.'
    ),
    createSentence('b2-9', 'B2', 'It is said that he is very rich.',
      [['Es', 'subject'], ['heißt', 'verb'], ['dass', 'conjunction'], ['er', 'subject'], ['sehr', 'adjective'], ['reich', 'adjective'], ['sei', 'verb']],
      [['heißen', 'verb'], ['weil', 'conjunction']],
      'Reported speech with Konj. I',
      '"Sei" is Konjunktiv I for reported speech.'
    ),
    createSentence('b2-10', 'B2', 'The more carefully you work, the fewer mistakes you make.',
      [['Je', 'conjunction'], ['sorgfältiger', 'adjective'], ['du', 'subject'], ['arbeitest', 'verb'], ['desto', 'conjunction'], ['weniger', 'adjective'], ['Fehler', 'object'], ['machst', 'verb'], ['du', 'subject']],
      [['Weil', 'conjunction'], ['arbeiten', 'verb']],
      '"Je...desto" with adjectives',
      'Correlative comparative structure.'
    ),
    createSentence('b2-11', 'B2', 'However difficult it may be, we will try.',
      [['Wie', 'conjunction'], ['schwierig', 'adjective'], ['es', 'subject'], ['auch', 'particle'], ['sein', 'verb'], ['mag', 'auxiliary'], ['werden', 'auxiliary'], ['wir', 'subject'], ['es', 'object'], ['versuchen', 'verb']],
      [['Weil', 'conjunction'], ['ist', 'verb']],
      'Concessive with "mögen"',
      '"Mag" (may) adds uncertainty to concession.'
    ),
    createSentence('b2-12', 'B2', 'In case he calls, tell him I am busy.',
      [['Falls', 'conjunction'], ['er', 'subject'], ['anruft', 'verb'], ['sag', 'verb'], ['ihm', 'object'], ['dass', 'conjunction'], ['ich', 'subject'], ['beschäftigt', 'adjective'], ['bin', 'verb']],
      [['Weil', 'conjunction'], ['anrufen', 'verb']],
      '"Falls" conditional',
      '"Falls" (in case) introduces potential condition.'
    ),
    createSentence('b2-13', 'B2', 'Not until he apologizes will I forgive him.',
      [['Erst', 'particle'], ['wenn', 'conjunction'], ['er', 'subject'], ['sich', 'object'], ['entschuldigt', 'verb'], ['werde', 'auxiliary'], ['ich', 'subject'], ['ihm', 'object'], ['verzeihen', 'verb']],
      [['Weil', 'conjunction'], ['entschuldigen', 'verb']],
      '"Erst wenn" delayed condition',
      '"Erst wenn" (not until) delayed condition.'
    ),
    createSentence('b2-14', 'B2', 'She speaks as if she were an expert.',
      [['Sie', 'subject'], ['spricht', 'verb'], ['als', 'conjunction'], ['ob', 'conjunction'], ['sie', 'subject'], ['eine', 'article'], ['Expertin', 'object'], ['wäre', 'verb']],
      [['sprechen', 'verb'], ['weil', 'conjunction']],
      '"Als ob" with Konj. II',
      '"Als ob" + Konjunktiv II for unreal comparison.'
    ),
    createSentence('b2-15', 'B2', 'Given that circumstances have changed, we must adapt.',
      [['Angesichts', 'particle'], ['dessen', 'conjunction'], ['dass', 'conjunction'], ['sich', 'object'], ['die', 'article'], ['Umstände', 'subject'], ['geändert', 'verb'], ['haben', 'auxiliary'], ['müssen', 'auxiliary'], ['wir', 'subject'], ['uns', 'object'], ['anpassen', 'verb']],
      [['Weil', 'conjunction'], ['ändern', 'verb']],
      '"Angesichts dessen dass"',
      'Complex phrase: "given that".'
    ),
    createSentence('b2-16', 'B2', 'Much as I would like to help, I cannot.',
      [['So', 'particle'], ['gern', 'adjective'], ['ich', 'subject'], ['auch', 'particle'], ['helfen', 'verb'], ['würde', 'auxiliary'], ['kann', 'auxiliary'], ['ich', 'subject'], ['nicht', 'particle']],
      [['Weil', 'conjunction'], ['helfen', 'verb']],
      'Concessive with "so gern"',
      '"So gern...auch würde" expresses reluctant inability.'
    ),
    createSentence('b2-17', 'B2', 'The fact that he lied bothers me.',
      [['Die', 'article'], ['Tatsache', 'subject'], ['dass', 'conjunction'], ['er', 'subject'], ['gelogen', 'verb'], ['hat', 'auxiliary'], ['stört', 'verb'], ['mich', 'object']],
      [['Der', 'article'], ['lügen', 'verb']],
      'Noun + dass clause',
      '"Die Tatsache dass" (the fact that) structure.'
    ),
    createSentence('b2-18', 'B2', 'There is no doubt that she will succeed.',
      [['Es', 'subject'], ['besteht', 'verb'], ['kein', 'article'], ['Zweifel', 'object'], ['dass', 'conjunction'], ['sie', 'subject'], ['Erfolg', 'object'], ['haben', 'verb'], ['wird', 'auxiliary']],
      [['Weil', 'conjunction'], ['haben', 'verb']],
      'Doubt + dass clause',
      'Future in subordinate: infinitive + "wird" at end.'
    ),
    createSentence('b2-19', 'B2', 'The question is whether we can afford it.',
      [['Die', 'article'], ['Frage', 'subject'], ['ist', 'verb'], ['ob', 'conjunction'], ['wir', 'subject'], ['es', 'object'], ['uns', 'object'], ['leisten', 'verb'], ['können', 'auxiliary']],
      [['Der', 'article'], ['dass', 'conjunction']],
      'Ob-clause as predicate',
      '"Ob" clause functions as predicate.'
    ),
    createSentence('b2-20', 'B2', 'I have the impression that something is wrong.',
      [['Ich', 'subject'], ['habe', 'verb'], ['den', 'article'], ['Eindruck', 'object'], ['dass', 'conjunction'], ['etwas', 'subject'], ['nicht', 'particle'], ['stimmt', 'verb']],
      [['hab', 'verb'], ['weil', 'conjunction']],
      'Expression + dass',
      '"Den Eindruck haben dass" (to have the impression that).'
    ),
    createSentence('b2-21', 'B2', 'Be that as it may, we must continue.',
      [['Wie', 'conjunction'], ['dem', 'article'], ['auch', 'particle'], ['sei', 'verb'], ['wir', 'subject'], ['müssen', 'auxiliary'], ['weitermachen', 'verb']],
      [['Weil', 'conjunction'], ['ist', 'verb']],
      'Idiomatic concessive',
      '"Wie dem auch sei" (be that as it may) fixed expression.'
    ),
    createSentence('b2-22', 'B2', 'It remains to be seen whether this works.',
      [['Es', 'subject'], ['bleibt', 'verb'], ['abzuwarten', 'verb'], ['ob', 'conjunction'], ['das', 'subject'], ['funktioniert', 'verb']],
      [['Weil', 'conjunction'], ['funktionieren', 'verb']],
      '"Abzuwarten" + ob',
      '"Es bleibt abzuwarten" (it remains to be seen).'
    ),
    createSentence('b2-23', 'B2', 'Unless there is an emergency, do not call.',
      [['Sofern', 'conjunction'], ['es', 'subject'], ['keinen', 'article'], ['Notfall', 'object'], ['gibt', 'verb'], ['ruf', 'verb'], ['nicht', 'particle'], ['an', 'particle']],
      [['Weil', 'conjunction'], ['geben', 'verb']],
      '"Sofern" conditional',
      '"Sofern" (unless/provided) conditional conjunction.'
    ),
    createSentence('b2-24', 'B2', 'Inasmuch as this is relevant, we should discuss it.',
      [['Insofern', 'conjunction'], ['das', 'subject'], ['relevant', 'adjective'], ['ist', 'verb'], ['sollten', 'auxiliary'], ['wir', 'subject'], ['es', 'object'], ['besprechen', 'verb']],
      [['Weil', 'conjunction'], ['sein', 'verb']],
      '"Insofern" clause',
      '"Insofern" (inasmuch as) introduces relevance condition.'
    ),
    createSentence('b2-25', 'B2', 'It goes without saying that punctuality is important.',
      [['Es', 'subject'], ['versteht', 'verb'], ['sich', 'object'], ['von', 'particle'], ['selbst', 'particle'], ['dass', 'conjunction'], ['Pünktlichkeit', 'subject'], ['wichtig', 'adjective'], ['ist', 'verb']],
      [['verstehen', 'verb'], ['weil', 'conjunction']],
      'Idiomatic + dass',
      '"Es versteht sich von selbst" (it goes without saying).'
    ),
    createSentence('b2-26', 'B2', 'No sooner had he arrived than it started raining.',
      [['Kaum', 'particle'], ['war', 'auxiliary'], ['er', 'subject'], ['angekommen', 'verb'], ['da', 'conjunction'], ['fing', 'verb'], ['es', 'subject'], ['an', 'particle'], ['zu', 'particle'], ['regnen', 'verb']],
      [['ist', 'auxiliary'], ['ankommen', 'verb']],
      '"Kaum...da" structure',
      '"Kaum...da" (no sooner...than) temporal structure.'
    ),
    createSentence('b2-27', 'B2', 'All things considered, it was a success.',
      [['Alles', 'subject'], ['in', 'particle'], ['allem', 'object'], ['war', 'verb'], ['es', 'subject'], ['ein', 'article'], ['Erfolg', 'object']],
      [['Weil', 'conjunction'], ['ist', 'verb']],
      'Idiomatic phrase',
      '"Alles in allem" (all things considered).'
    ),
    createSentence('b2-28', 'B2', 'It is high time that we left.',
      [['Es', 'subject'], ['ist', 'verb'], ['höchste', 'adjective'], ['Zeit', 'object'], ['dass', 'conjunction'], ['wir', 'subject'], ['gehen', 'verb']],
      [['Weil', 'conjunction'], ['gegangen', 'verb']],
      '"Höchste Zeit" + dass',
      '"Es ist höchste Zeit" (it is high time).'
    ),
    createSentence('b2-29', 'B2', 'For fear that he would fail, he studied hard.',
      [['Aus', 'particle'], ['Angst', 'object'], ['dass', 'conjunction'], ['er', 'subject'], ['durchfallen', 'verb'], ['würde', 'auxiliary'], ['lernte', 'verb'], ['er', 'subject'], ['fleißig', 'adjective']],
      [['Weil', 'conjunction'], ['durchfällt', 'verb']],
      '"Aus Angst dass"',
      '"Aus Angst dass" (for fear that) expression.'
    ),
    createSentence('b2-30', 'B2', 'Strange as it may seem, it is true.',
      [['So', 'particle'], ['seltsam', 'adjective'], ['es', 'subject'], ['auch', 'particle'], ['klingen', 'verb'], ['mag', 'auxiliary'], ['es', 'subject'], ['ist', 'verb'], ['wahr', 'adjective']],
      [['Weil', 'conjunction'], ['klingt', 'verb']],
      'Concessive with "mögen"',
      '"So...auch klingen mag" concessive structure.'
    ),
  ],

  C1: [
    // === 30+ C1 Sentences - Passive voice, complex constructions ===
    createSentence('c1-1', 'C1', 'The work was completed yesterday.',
      [['Die', 'article'], ['Arbeit', 'subject'], ['wurde', 'auxiliary'], ['gestern', 'time'], ['fertiggestellt', 'verb']],
      [['Der', 'article'], ['war', 'auxiliary']],
      'Passive voice (Präteritum)',
      'Passive: "werden" (wurde) + past participle.'
    ),
    createSentence('c1-2', 'C1', 'This should have been done earlier.',
      [['Das', 'subject'], ['hätte', 'auxiliary'], ['früher', 'time'], ['gemacht', 'verb'], ['werden', 'auxiliary'], ['sollen', 'verb']],
      [['Weil', 'conjunction'], ['machen', 'verb']],
      'Modal passive perfect',
      'Complex: Konjunktiv II + passive + modal.'
    ),
    createSentence('c1-3', 'C1', 'The extensively discussed topic was resolved.',
      [['Das', 'article'], ['ausführlich', 'adjective'], ['besprochene', 'adjective'], ['Thema', 'subject'], ['wurde', 'auxiliary'], ['geklärt', 'verb']],
      [['Der', 'article'], ['besprochen', 'adjective']],
      'Extended participle',
      'Extended participial attribute: "ausführlich besprochene".'
    ),
    createSentence('c1-4', 'C1', 'Without considering the consequences, he acted.',
      [['Ohne', 'conjunction'], ['die', 'article'], ['Folgen', 'object'], ['zu', 'particle'], ['bedenken', 'verb'], ['handelte', 'verb'], ['er', 'subject']],
      [['Mit', 'conjunction'], ['Folge', 'object']],
      '"Ohne zu" infinitive',
      '"Ohne zu" (without -ing) infinitive construction.'
    ),
    createSentence('c1-5', 'C1', 'The report is being prepared.',
      [['Der', 'article'], ['Bericht', 'subject'], ['wird', 'auxiliary'], ['gerade', 'time'], ['vorbereitet', 'verb']],
      [['Die', 'article'], ['war', 'auxiliary']],
      'Passive present',
      'Present passive: "wird" + past participle.'
    ),
    createSentence('c1-6', 'C1', 'The decision having been made, we proceed.',
      [['Nachdem', 'conjunction'], ['die', 'article'], ['Entscheidung', 'subject'], ['getroffen', 'verb'], ['worden', 'auxiliary'], ['ist', 'auxiliary'], ['gehen', 'verb'], ['wir', 'subject'], ['weiter', 'particle']],
      [['Weil', 'conjunction'], ['treffen', 'verb']],
      'Perfect passive subordinate',
      'Perfect passive in subordinate clause.'
    ),
    createSentence('c1-7', 'C1', 'It is to be hoped that improvements are made.',
      [['Es', 'subject'], ['bleibt', 'verb'], ['zu', 'particle'], ['hoffen', 'verb'], ['dass', 'conjunction'], ['Verbesserungen', 'subject'], ['vorgenommen', 'verb'], ['werden', 'auxiliary']],
      [['Weil', 'conjunction'], ['verbessern', 'verb']],
      '"Zu + infinitive" passive meaning',
      '"Es bleibt zu hoffen" expresses passive necessity.'
    ),
    createSentence('c1-8', 'C1', 'The task being too difficult, he gave up.',
      [['Da', 'conjunction'], ['die', 'article'], ['Aufgabe', 'subject'], ['zu', 'particle'], ['schwierig', 'adjective'], ['war', 'verb'], ['gab', 'verb'], ['er', 'subject'], ['auf', 'particle']],
      [['Weil', 'conjunction'], ['ist', 'verb']],
      'Causal participle clause',
      '"Da" clause expressing cause.'
    ),
    createSentence('c1-9', 'C1', 'The participants were informed by email.',
      [['Die', 'article'], ['Teilnehmer', 'subject'], ['wurden', 'auxiliary'], ['per', 'particle'], ['E-Mail', 'object'], ['informiert', 'verb']],
      [['Der', 'article'], ['war', 'auxiliary']],
      'Passive with agent',
      'Passive voice with manner/instrument (per E-Mail).'
    ),
    createSentence('c1-10', 'C1', 'The problem needs to be solved.',
      [['Das', 'article'], ['Problem', 'subject'], ['muss', 'auxiliary'], ['gelöst', 'verb'], ['werden', 'auxiliary']],
      [['Der', 'article'], ['müssen', 'auxiliary']],
      'Modal passive',
      'Modal + passive: "muss...gelöst werden".'
    ),
    createSentence('c1-11', 'C1', 'Having finished the work, she left.',
      [['Nachdem', 'conjunction'], ['sie', 'subject'], ['die', 'article'], ['Arbeit', 'object'], ['beendet', 'verb'], ['hatte', 'auxiliary'], ['ging', 'verb'], ['sie', 'subject']],
      [['Weil', 'conjunction'], ['beenden', 'verb']],
      'Past perfect subordinate',
      '"Nachdem" + past perfect for completed prior action.'
    ),
    createSentence('c1-12', 'C1', 'The matter is considered resolved.',
      [['Die', 'article'], ['Angelegenheit', 'subject'], ['gilt', 'verb'], ['als', 'particle'], ['erledigt', 'adjective']],
      [['Der', 'article'], ['gelten', 'verb']],
      '"Gelten als" construction',
      '"Gelten als" (to be considered as) + adjective.'
    ),
    createSentence('c1-13', 'C1', 'The damage caused is significant.',
      [['Der', 'article'], ['verursachte', 'adjective'], ['Schaden', 'subject'], ['ist', 'verb'], ['erheblich', 'adjective']],
      [['Die', 'article'], ['verursachen', 'verb']],
      'Participial adjective',
      '"Verursachte" is past participle used as adjective.'
    ),
    createSentence('c1-14', 'C1', 'This being the case, we must reconsider.',
      [['Dies', 'subject'], ['vorausgesetzt', 'verb'], ['müssen', 'auxiliary'], ['wir', 'subject'], ['die', 'article'], ['Sache', 'object'], ['überdenken', 'verb']],
      [['Weil', 'conjunction'], ['voraussetzen', 'verb']],
      'Absolute participial',
      '"Dies vorausgesetzt" (this being the case) absolute construction.'
    ),
    createSentence('c1-15', 'C1', 'The project can be realized.',
      [['Das', 'article'], ['Projekt', 'subject'], ['lässt', 'verb'], ['sich', 'object'], ['realisieren', 'verb']],
      [['Der', 'article'], ['lassen', 'verb']],
      '"Sich lassen" passive',
      '"Lässt sich" expresses possibility/passive.'
    ),
    createSentence('c1-16', 'C1', 'Not having received a reply, I called.',
      [['Da', 'conjunction'], ['ich', 'subject'], ['keine', 'article'], ['Antwort', 'object'], ['erhalten', 'verb'], ['hatte', 'auxiliary'], ['rief', 'verb'], ['ich', 'subject'], ['an', 'particle']],
      [['Weil', 'conjunction'], ['erhält', 'verb']],
      'Causal past perfect',
      'Past perfect in causal clause for prior event.'
    ),
    createSentence('c1-17', 'C1', 'The suggestion was rejected unanimously.',
      [['Der', 'article'], ['Vorschlag', 'subject'], ['wurde', 'auxiliary'], ['einstimmig', 'adjective'], ['abgelehnt', 'verb']],
      [['Die', 'article'], ['war', 'auxiliary']],
      'Passive with adverb',
      'Passive with manner adverb (einstimmig).'
    ),
    createSentence('c1-18', 'C1', 'The well-known phenomenon was studied.',
      [['Das', 'article'], ['wohlbekannte', 'adjective'], ['Phänomen', 'subject'], ['wurde', 'auxiliary'], ['untersucht', 'verb']],
      [['Der', 'article'], ['war', 'auxiliary']],
      'Compound adjective',
      '"Wohlbekannt" compound participial adjective.'
    ),
    createSentence('c1-19', 'C1', 'The contract is yet to be signed.',
      [['Der', 'article'], ['Vertrag', 'subject'], ['ist', 'verb'], ['noch', 'particle'], ['zu', 'particle'], ['unterschreiben', 'verb']],
      [['Die', 'article'], ['sein', 'verb']],
      '"Sein zu" modal passive',
      '"Ist zu" expresses necessity/obligation.'
    ),
    createSentence('c1-20', 'C1', 'The recently published report confirms this.',
      [['Der', 'article'], ['kürzlich', 'adjective'], ['veröffentlichte', 'adjective'], ['Bericht', 'subject'], ['bestätigt', 'verb'], ['dies', 'object']],
      [['Die', 'article'], ['veröffentlichen', 'verb']],
      'Extended participial',
      '"Kürzlich veröffentlichte" extended participle attribute.'
    ),
  ],

  C2: [
    // === 25+ C2 Sentences - Literary and complex structures ===
    createSentence('c2-1', 'C2', 'The decision, hard as it was, had to be made.',
      [['Die', 'article'], ['Entscheidung', 'subject'], ['so', 'particle'], ['schwer', 'adjective'], ['sie', 'subject'], ['auch', 'particle'], ['war', 'verb'], ['musste', 'auxiliary'], ['getroffen', 'verb'], ['werden', 'auxiliary']],
      [['Der', 'article'], ['weil', 'conjunction']],
      'Concessive parenthetical',
      '"So...auch war" parenthetical concessive clause.'
    ),
    createSentence('c2-2', 'C2', 'Were it not for him, we would have failed.',
      [['Wäre', 'auxiliary'], ['er', 'subject'], ['nicht', 'particle'], ['gewesen', 'verb'], ['hätten', 'auxiliary'], ['wir', 'subject'], ['versagt', 'verb']],
      [['Wenn', 'conjunction'], ['ist', 'verb']],
      'Inverted conditional',
      'Verb-first conditional (no "wenn") for literary style.'
    ),
    createSentence('c2-3', 'C2', 'The by many expected breakthrough did not come.',
      [['Der', 'article'], ['von', 'particle'], ['vielen', 'adjective'], ['erwartete', 'adjective'], ['Durchbruch', 'subject'], ['blieb', 'verb'], ['aus', 'particle']],
      [['Die', 'article'], ['erwarten', 'verb']],
      'Extended participial phrase',
      '"Von vielen erwartete" is extended participial attribute.'
    ),
    createSentence('c2-4', 'C2', 'Be it ever so humble, there is no place like home.',
      [['Sei', 'verb'], ['es', 'subject'], ['noch', 'particle'], ['so', 'particle'], ['bescheiden', 'adjective'], ['es', 'subject'], ['geht', 'verb'], ['nichts', 'object'], ['über', 'particle'], ['das', 'article'], ['eigene', 'adjective'], ['Zuhause', 'object']],
      [['Weil', 'conjunction'], ['ist', 'verb']],
      'Konjunktiv I concessive',
      '"Sei es noch so" Konjunktiv I for literary concession.'
    ),
    createSentence('c2-5', 'C2', 'That having been said, we proceed.',
      [['Dessen', 'conjunction'], ['ungeachtet', 'particle'], ['fahren', 'verb'], ['wir', 'subject'], ['fort', 'particle']],
      [['Weil', 'conjunction'], ['fortfahren', 'verb']],
      'Participial concessive',
      '"Dessen ungeachtet" (that notwithstanding) formal concessive.'
    ),
    createSentence('c2-6', 'C2', 'Not without reason is it claimed that...',
      [['Nicht', 'particle'], ['umsonst', 'particle'], ['wird', 'auxiliary'], ['behauptet', 'verb'], ['dass', 'conjunction']],
      [['Weil', 'conjunction'], ['behaupten', 'verb']],
      'Inverted emphasis',
      'Inversion for emphasis: "Nicht umsonst wird...".'
    ),
    createSentence('c2-7', 'C2', 'Far be it from me to criticize.',
      [['Es', 'subject'], ['liegt', 'verb'], ['mir', 'object'], ['fern', 'particle'], ['zu', 'particle'], ['kritisieren', 'verb']],
      [['Weil', 'conjunction'], ['liegen', 'verb']],
      'Idiomatic distancing',
      '"Es liegt mir fern" (far be it from me) formal expression.'
    ),
    createSentence('c2-8', 'C2', 'The situation being what it is, we must adapt.',
      [['Die', 'article'], ['Lage', 'subject'], ['so', 'particle'], ['wie', 'conjunction'], ['sie', 'subject'], ['nun', 'particle'], ['einmal', 'particle'], ['ist', 'verb'], ['müssen', 'auxiliary'], ['wir', 'subject'], ['uns', 'object'], ['anpassen', 'verb']],
      [['Der', 'article'], ['weil', 'conjunction']],
      'Embedded absolute clause',
      '"So wie sie nun einmal ist" absolute clause.'
    ),
    createSentence('c2-9', 'C2', 'It behooves us to consider this carefully.',
      [['Es', 'subject'], ['obliegt', 'verb'], ['uns', 'object'], ['dies', 'object'], ['sorgfältig', 'adjective'], ['zu', 'particle'], ['bedenken', 'verb']],
      [['Weil', 'conjunction'], ['obliegen', 'verb']],
      'Formal obligation',
      '"Es obliegt uns" (it behooves us) formal style.'
    ),
    createSentence('c2-10', 'C2', 'Therein lies the problem.',
      [['Darin', 'particle'], ['liegt', 'verb'], ['das', 'article'], ['Problem', 'subject']],
      [['Weil', 'conjunction'], ['liegen', 'verb']],
      'Inverted word order',
      'Adverb-first inversion for emphasis.'
    ),
    createSentence('c2-11', 'C2', 'Lest we forget, I remind you.',
      [['Damit', 'conjunction'], ['wir', 'subject'], ['nicht', 'particle'], ['vergessen', 'verb'], ['erinnere', 'verb'], ['ich', 'subject'], ['euch', 'object']],
      [['Weil', 'conjunction'], ['vergessen', 'verb']],
      '"Damit...nicht" lest',
      '"Damit...nicht" (lest) purpose with negation.'
    ),
    createSentence('c2-12', 'C2', 'Notwithstanding his objections, we proceeded.',
      [['Ungeachtet', 'particle'], ['seiner', 'article'], ['Einwände', 'object'], ['fuhren', 'verb'], ['wir', 'subject'], ['fort', 'particle']],
      [['Weil', 'conjunction'], ['sein', 'article']],
      'Prepositional concessive',
      '"Ungeachtet" (notwithstanding) + genitive.'
    ),
    createSentence('c2-13', 'C2', 'The problem, however significant, must be addressed.',
      [['Das', 'article'], ['Problem', 'subject'], ['wie', 'conjunction'], ['bedeutsam', 'adjective'], ['es', 'subject'], ['auch', 'particle'], ['sei', 'verb'], ['muss', 'auxiliary'], ['angegangen', 'verb'], ['werden', 'auxiliary']],
      [['Der', 'article'], ['weil', 'conjunction']],
      'Konjunktiv I concessive',
      '"Wie...auch sei" Konjunktiv I concessive.'
    ),
    createSentence('c2-14', 'C2', 'Suffice it to say that matters have changed.',
      [['Es', 'subject'], ['genügt', 'verb'], ['zu', 'particle'], ['sagen', 'verb'], ['dass', 'conjunction'], ['sich', 'object'], ['die', 'article'], ['Dinge', 'subject'], ['geändert', 'verb'], ['haben', 'auxiliary']],
      [['Weil', 'conjunction'], ['genügen', 'verb']],
      'Formal summary',
      '"Es genügt zu sagen" (suffice it to say) formal.'
    ),
    createSentence('c2-15', 'C2', 'Come what may, we stand firm.',
      [['Komme', 'verb'], ['was', 'subject'], ['da', 'particle'], ['wolle', 'verb'], ['wir', 'subject'], ['bleiben', 'verb'], ['standhaft', 'adjective']],
      [['Weil', 'conjunction'], ['kommen', 'verb']],
      'Konjunktiv I concessive',
      '"Komme was da wolle" (come what may) literary.'
    ),
    createSentence('c2-16', 'C2', 'By virtue of his position, he was informed.',
      [['Kraft', 'particle'], ['seines', 'article'], ['Amtes', 'object'], ['wurde', 'auxiliary'], ['er', 'subject'], ['informiert', 'verb']],
      [['Weil', 'conjunction'], ['sein', 'article']],
      'Formal causal phrase',
      '"Kraft seines Amtes" (by virtue of) + genitive.'
    ),
    createSentence('c2-17', 'C2', 'All appearances to the contrary notwithstanding.',
      [['Allen', 'adjective'], ['gegenteiligen', 'adjective'], ['Anscheins', 'object'], ['ungeachtet', 'particle']],
      [['Weil', 'conjunction'], ['aller', 'adjective']],
      'Formal concessive phrase',
      'Complex genitive concessive phrase.'
    ),
    createSentence('c2-18', 'C2', 'Insofar as this pertains to us, we shall respond.',
      [['Insoweit', 'conjunction'], ['dies', 'subject'], ['uns', 'object'], ['betrifft', 'verb'], ['werden', 'auxiliary'], ['wir', 'subject'], ['Stellung', 'object'], ['nehmen', 'verb']],
      [['Weil', 'conjunction'], ['betreffen', 'verb']],
      '"Insoweit" scope clause',
      '"Insoweit" (insofar as) formal scope.'
    ),
    createSentence('c2-19', 'C2', 'Little did he know what awaited him.',
      [['Wenig', 'particle'], ['ahnte', 'verb'], ['er', 'subject'], ['was', 'conjunction'], ['ihn', 'object'], ['erwartete', 'verb']],
      [['Weil', 'conjunction'], ['ahnen', 'verb']],
      'Inverted emphasis',
      'Adverb-first inversion for narrative emphasis.'
    ),
    createSentence('c2-20', 'C2', 'However one may view it, the fact remains.',
      [['Wie', 'conjunction'], ['man', 'subject'], ['es', 'object'], ['auch', 'particle'], ['betrachten', 'verb'], ['mag', 'auxiliary'], ['die', 'article'], ['Tatsache', 'subject'], ['bleibt', 'verb']],
      [['Weil', 'conjunction'], ['betrachtet', 'verb']],
      'Concessive with "mögen"',
      '"Wie...auch...mag" concessive with uncertainty.'
    ),
  ],
};

// Level metadata for Satz-Splitter - UPDATED TIMES
export const SENTENCE_LEVEL_INFO: Record<Level, { name: string; description: string; timeLimit: number }> = {
  A1: { name: 'A1', description: 'Simple main clauses', timeLimit: 30 },
  A2: { name: 'A2', description: 'Time & Place expressions', timeLimit: 28 },
  B1: { name: 'B1', description: 'Subordinate clauses', timeLimit: 24 },
  B2: { name: 'B2', description: 'Complex conjunctions', timeLimit: 24 },
  C1: { name: 'C1', description: 'Passive constructions', timeLimit: 26 },
  C2: { name: 'C2', description: 'Literary structures', timeLimit: 32 },
};

// Get random sentence from level
export const getRandomSentence = (level: Level): Sentence => {
  const sentences = SENTENCE_DATABASE[level];
  return sentences[Math.floor(Math.random() * sentences.length)];
};

// Shuffle words for gameplay (keeping track of correct positions)
export const shuffleWords = (sentence: Sentence): SentenceWord[] => {
  // Combine real words and distractors
  const allWords = [...sentence.words, ...sentence.distractors];
  
  // Fisher-Yates shuffle
  const shuffled = [...allWords];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Check if a word is a distractor
export const isDistractor = (word: SentenceWord): boolean => {
  return word.isDistractor === true;
};
