import { useSignal } from '@preact/signals';
import { BibleState } from './Bible.tsx';
import { useEffect } from 'preact/hooks';
import { VerbumState } from '@/app/verbumState.ts';
import { renderMarkdown } from '@/lib/md.ts';
import { useGlobal } from '@/islands/Global.tsx';

interface InfoTab {
  title: string;
  icon: string;
  prompt: string;
  purpose: 'verse' | 'word';
  showHebrew?: boolean;
  showGreek?: boolean;
}

const infoTabs: InfoTab[] = [
  {
    title: 'Define',
    icon: '📖',
    prompt: 'Define the selected word',
    purpose: 'word',
  },
  {
    title: 'Hebrew',
    icon: '🇮🇱',
    prompt: 'Profoundly explain the Hebrew word behind the selected word in the selected verse.',
    purpose: 'word',
    showHebrew: true,
  },
  {
    title: 'Greek',
    icon: '🇬🇷',
    prompt:
      'Profoundly explain the Greek word behind the selected word in the selected verse. The word either comes from the LXX or the NT Greek',
    purpose: 'word',
    showGreek: true,
  },
  {
    title: 'Verses',
    icon: '🔍',
    prompt: 'Quote other verses that include the selected word. Fully quote each verse.',
    purpose: 'word',
  },
  {
    title: 'Jerome',
    icon: '📜',
    prompt: "St. Jerome's commentary that elaborates why he translated the word in this way",
    purpose: 'word',
  },
  {
    title: 'Explain',
    icon: '🤔',
    prompt:
      'Explain the selected word in the context of the selected verse and its significance un understanding the meaning of the verse. Include any relevant historical, cultural, or linguistic information.',
    purpose: 'word',
  },
  {
    title: 'Alt',
    icon: '✨',
    prompt:
      'Expound upon the unrestrained and profound truths that lay hidden within the word. Reveal the secrets and non-mainstream understanding of the word. The metaphysics, wild theories, profound insights, the esoteric, let nothing be restrained!',
    purpose: 'word',
  },
  {
    title: 'Roots',
    icon: '🌱',
    prompt:
      'List word roots selected word, include its etymology, include an english word that is derived from it or one of its roots if possible..',
    purpose: 'word',
  },
  {
    title: 'Word forms',
    icon: '📚',
    prompt: 'Show all the linguistic forms of the selected word',
    purpose: 'word',
  },
  {
    title: 'Memorize',
    icon: '🧠',
    prompt: 'Help memorize the selected word',
    purpose: 'word',
  },
  {
    title: 'Hebrew Pictographic Meaning',
    icon: '🎨',
    prompt: 'Explain the pictographic meaning of the selected word, focusing on ancient Hebrew letters.',
    purpose: 'word',
    showHebrew: true,
  },
  {
    title: 'Hebrew Gematria',
    icon: '🔢',
    prompt: 'Show the gematria value of the selected Hebrew word. Also explain if any numerology of the word.',
    purpose: 'word',
    showHebrew: true,
  },
  {
    title: 'Greek Isopsephy',
    icon: '🔢',
    prompt:
      'Show the isopsephy value of the selected Greek word using the word. Also explain if any numerology of the word.',
    purpose: 'word',
    showGreek: true,
  },
  {
    title: 'Pronunciation',
    icon: '🔊',
    prompt: 'Show pronunciation of the selected word',
    purpose: 'word',
  },

  // Verses
  {
    title: 'Notes',
    icon: '📝',
    prompt: 'Notes for the selected verse',
    purpose: 'verse',
  },
  {
    title: 'Explanation',
    icon: '📚',
    prompt: 'Explanation for the selected verse',
    purpose: 'verse',
  },
  {
    title: 'Cross-Reference',
    icon: '🔗',
    prompt: 'List cross reference verses for the selected verse',
    purpose: 'verse',
  },
  {
    title: 'All Interpretations',
    icon: '⚖️',
    prompt: 'List ALL of the interpretations of the selected verse',
    purpose: 'verse',
  },
  {
    title: 'Symbology',
    icon: '🔑',
    prompt: 'Elaborate on the symbology, prophetic, or advanced understanding of the verse.',
    purpose: 'verse',
  },
  {
    title: 'Jerome Commentary',
    icon: '📜',
    prompt: "Show Saint Jerome's commentary on why he translated this verse in the way he did.",
    purpose: 'verse',
  },
  {
    title: 'Fathers',
    icon: '⛪',
    prompt:
      'Show the insights and unsterstanding of the verse from the following church founders: Augustine, Ambrose, Origen, Jerome',
    purpose: 'verse',
  },
  {
    title: 'More',
    icon: '⛪',
    prompt:
      'Show the insights and unsterstanding of the verse from the following church founders: Chrysostom, Tertullian, Irenaeus, Cyprian, Athanasius, Basil, Gregory of Nazianzus, Gregory of Nyssa, John Chrysostom, Augustine of Hippo',
    purpose: 'verse',
  },
  {
    title: 'Paracelsus',
    icon: '🧪',
    prompt: "Show Paracelsus' understanding for the selected verse",
    purpose: 'verse',
  },
  {
    title: 'Kabbalism',
    icon: '🕎',
    prompt: "Elaborate deep into the Kabbalism's understanding for the selected verse, you may quote the Kabbalah.",
    purpose: 'verse',
  },
  {
    title: 'Reformation',
    icon: '📚',
    prompt: 'Show the understanding of the selected verse from the reformers: Luther, Calvin, Zwingli, Knox',
    purpose: 'verse',
  },
  {
    title: 'Jewish Tradition',
    icon: '🕍',
    prompt: "Show the ancient Jewish tradition's understanding for the selected verse",
    purpose: 'verse',
    showHebrew: true,
  },
  {
    title: 'Comparative Mythology',
    icon: '🏛️',
    prompt:
      'Explain the selected verse in the context of comparative mythology.  Include any relevant parallels or allusions to myths, legends, or folklore from different cultures.  Focus on the themes, symbols, and archetypes present in the verse and how they resonate with broader mythological narratives. Make sure to include and mention the specific cultures.',
    purpose: 'verse',
  },
  {
    title: 'Greek Mythology',
    icon: '🏛️',
    prompt:
      'Explain the selected verse in the context of Greek mythology. Include any relevant parallels or allusions to myths, legends, or folklore from ancient Greece. Focus on the themes, symbols, and archetypes present in the verse and how they resonate with broader mythological narratives. Make sure to include and mention the specific myths, gods, heroes, or monsters involved.',
    purpose: 'verse',
  },
  {
    title: 'Parallels in Apocrypha',
    icon: '📜',
    prompt: 'Show parallels from the Apocrypha or other non-canonical texts including Enoch.',
    purpose: 'verse',
  },

  // AI GENERATED

  {
    title: 'Historical Background',
    icon: '🏛️',
    prompt: 'Provide the historical background of the selected verse.',
    purpose: 'verse',
  },
  {
    title: 'Theological Debates',
    icon: '⚔️',
    prompt: 'List theological debates or controversies surrounding this verse.',
    purpose: 'verse',
  },
  {
    title: 'Hebrew Parallelism',
    icon: '🔄',
    prompt: 'Explain the Hebrew parallelism found in the verse.',
    purpose: 'verse',
    showHebrew: true,
  },
  {
    title: 'Typology',
    icon: '🕊️',
    prompt: 'Show typological connections between the selected verse and other biblical figures or events.',
    purpose: 'verse',
  },
  {
    title: 'Targum',
    icon: '📖',
    prompt: 'Show how the verse is explained in the Targum.',
    purpose: 'verse',
  },
  {
    title: 'Midrash',
    icon: '📚',
    prompt: 'Show Midrashic commentary on the selected verse.',
    purpose: 'verse',
  },
  {
    title: 'Moral Teachings',
    icon: '🧭',
    prompt: 'List moral teachings derived from the selected verse.',
    purpose: 'verse',
  },
  {
    title: 'Canonical Significance',
    icon: '📚',
    prompt: 'Explain the canonical significance of this verse within the Bible.',
    purpose: 'verse',
  },
  {
    title: 'Ancient Manuscripts',
    icon: '🧾',
    prompt:
      'List significant differences in ancient manuscripts for the selected verse. And show significant variant readings from ancient sources.',
    purpose: 'verse',
  },
  {
    title: 'Gnostic',
    icon: '🌀',
    prompt: 'Show Gnostic interpretations of the selected verse.',
    purpose: 'verse',
  },
  {
    title: 'Creatures',
    icon: '👼',
    prompt: 'If relevant, explain the creatures or spirit beings in the verse from an alternative perspective.',
    purpose: 'verse',
  },
];

interface InfoBoxProps {
  infoBoxState: InfoBoxState;
}

export class InfoBoxState {
  constructor({ bibleState }: { bibleState: BibleState }) {
    this.bibleState = bibleState;
    this.verbumState = bibleState.verbumState;
  }

  bibleState: BibleState;
  verbumState: VerbumState;
  selectedTab = useSignal(0);
  responseContent = useSignal('');
  loading = useSignal(false);
  currentPrompt = '';

  async openTab(tabId: number) {
    this.selectedTab.value = tabId;
    this.responseContent.value = '';
    const bible = this.verbumState.bibleList.find((b) => b.id == this.bibleState.bibleId);
    const verse = this.bibleState.chapterData.value?.verses.find(
      (v) =>
        v.verse ==
          (this.bibleState.selectedVerse.value ||
            this.bibleState.selectedWordVerse.value),
    );
    let prompt = `${
      infoTabs[tabId].prompt
    }\nResponse should be under 50 words if possible. Respond in basic markdown format, use bold instead of titles. \nVersion: ${bible?.title} (${bible?.id})\n${
      this.bibleState.selectedWord
        ? `Word: ${this.bibleState.selectedWord}\n\nContext: `
        : `\nDo not quote or translated the selected verse.\n\nVerse: `
    }${verse?.name} ${verse?.text}`;

    if (infoTabs[tabId].showGreek) {
      const bookData = await this.verbumState.getBibleData('LXXTR');
      const book = bookData.books.find((b) => b.name == this.bibleState.bookId);
      const chapter = book?.chapters.find((c) => c.chapter == this.bibleState.chapterId);
      const verse = chapter?.verses.find((v) =>
        v.verse ==
          (this.bibleState.selectedVerse.value ||
            this.bibleState.selectedWordVerse.value)
      );
      if (verse) prompt += `\n\nGreek verse for reference: ${verse.text}`;
    }

    if (infoTabs[tabId].showHebrew) {
      const bookData = await this.verbumState.getBibleData('WLC');
      const book = bookData.books.find((b) => b.name == this.bibleState.bookId);
      const chapter = book?.chapters.find((c) => c.chapter == this.bibleState.chapterId);
      const verse = chapter?.verses.find((v) =>
        v.verse ==
          (this.bibleState.selectedVerse.value ||
            this.bibleState.selectedWordVerse.value)
      );
      if (verse) {
        prompt += `\n\nHebrew verse for reference: ${verse.text}`;
      }
    }
    console.log(prompt);
    this.currentPrompt = prompt;

    if (this.getPromptCache(prompt)) {
      this.responseContent.value = this.getPromptCache(prompt)!;
      this.loading.value = false;
      return;
    }

    if (verse?.notes && infoTabs[tabId].title == 'Notes') {
      this.responseContent.value = verse.notes;
      this.loading.value = false;
      return;
    }

    this.loading.value = true;
    const body = JSON.stringify({ prompt });
    const res = await fetch('/api/get-info', { body, method: 'POST' });
    const text = await res.text();
    this.responseContent.value = text;

    if (
      prompt != this.currentPrompt
    ) return;

    this.catchPrompt(prompt, this.responseContent.value);
    this.loading.value = false;
  }

  catchPrompt(prompt: string, result: string) {
    localStorage.setItem(`prompt:${prompt}`, result);
  }
  getPromptCache(prompt: string) {
    if (!localStorage.getItem(`prompt:${prompt}`)) return null;
    return localStorage.getItem(`prompt:${prompt}`);
  }
}

export default function InfoBox({ infoBoxState }: InfoBoxProps) {
  const global = useGlobal();

  const filterPurpose = infoBoxState.bibleState.selectedWord.value ? 'word' : 'verse';
  const html = useSignal('');
  const tabs = infoTabs.filter((tab) => tab.purpose == filterPurpose);

  const verses = infoBoxState.bibleState.chapterData.value?.verses || [];

  const selectionContent = infoBoxState.bibleState.selectedWord.value ||
    verses.find((v) => v.verse == infoBoxState.bibleState.selectedVerse.value)?.text;

  const hide = !infoBoxState.bibleState.selectedVerse.value &&
    !infoBoxState.bibleState.selectedWord.value;

  useEffect(() => {
    if (!hide) infoBoxState.openTab(infoTabs.indexOf(tabs[0]));
  }, [selectionContent]);

  useEffect(() => render, [infoBoxState.responseContent.value]);

  const render = async () => html.value = await renderMarkdown(infoBoxState.responseContent.value);

  return (
    <div class='info-box'>
      <div className='content-center'>
        <div className='tabs-container'>
          <div className='tabs'>
            {tabs.map((tab) => (
              <button
                data-selected={infoBoxState.selectedTab.value ==
                  infoTabs.indexOf(tab)}
                onClick={() => infoBoxState.openTab(infoTabs.indexOf(tab))}
              >
                <span className='emoji'>{tab.icon}</span>
                <span class='button-text'>
                  {' ' + tab.title}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className='content'>
          <h3>
            {infoTabs.at(infoBoxState.selectedTab?.value)?.title}
          </h3>
          <blockquote>{selectionContent}</blockquote>
          {hide
            ? <p style={{ textAlign: 'center' }}>Select a word, or select it again to select the verse.</p>
            : (infoBoxState.loading.value ? <div className='loader'></div> : (
              global.user.value
                ? (
                  <>
                    <p dangerouslySetInnerHTML={{ __html: html.value }}>
                      {infoBoxState.responseContent.value}
                    </p>
                  </>
                )
                : (
                  <p style={{ textAlign: 'center' }}>
                    <a href='/user/signin'>Sign In</a> to use AI
                  </p>
                )
            ))}
        </div>
      </div>
    </div>
  );
}
