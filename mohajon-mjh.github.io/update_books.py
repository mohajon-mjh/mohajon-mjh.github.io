import json

price_desc = {
    "academic_books": (500, "Academic Books — textbooks and reference material designed for formal education."),
    "activity_books": (250, "Activity Books — books filled with puzzles and exercises for children's engagement."),
    "animation_movies": (350, "Animation Movies — animated films available on disc for home entertainment."),
    "art_books": (700, "Art Books — books showcasing artwork, techniques, and art history."),
    "audio_cds": (250, "Audio CDs — compact discs containing recorded music or audio content."),
    "audiobooks": (450, "Audiobooks — narrated recordings of books for listening entertainment."),
    "autobiography": (450, "Autobiography — a book in which the author recounts their own life story."),
    "biography": (450, "Biography — a book detailing the life story of a notable individual."),
    "blank_cds": (150, "Blank CDs — recordable compact discs used for burning audio or data."),
    "blank_dvds": (200, "Blank DVDs — recordable discs used for burning video or data."),
    "blu_ray_discs": (250, "Blu-ray Discs — recordable high-definition optical discs."),
    "blu_ray_movies": (500, "Blu-ray Movies — films available in high-definition Blu-ray format."),
    "blu_ray_players": (5500, "Blu-ray Players — devices used to play high-definition Blu-ray discs."),
    "bluetooth_headphones": (1800, "Bluetooth Headphones — wireless headphones offering convenient audio listening."),
    "bluetooth_speakers": (2200, "Bluetooth Speakers — wireless speakers used for portable audio playback."),
    "book_covers": (250, "Book Covers — protective covers designed to shield books from wear."),
    "book_stands": (600, "Book Stands — stands used to hold books upright for reading."),
    "bookends": (450, "Bookends — decorative supports used to keep books upright on a shelf."),
    "bookmarks": (100, "Bookmarks — markers used to keep a reader's place in a book."),
    "books": (400, "Books — a general range of printed reading material."),
    "books_headphones_music_notes": (500, "Books, Headphones & Music Notes Set — a bundled set of media and reading accessories."),
    "books_media_music": (300, "Books, Media & Music — a general range of books, media, and music products."),
    "books_media_music1": (300, "Books, Media & Music — a general range of books, media, and music products."),
    "business_books": (550, "Business Books — books covering business strategy, management, and entrepreneurship."),
    "calendars": (300, "Calendars — printed calendars used for tracking dates and schedules."),
    "cassette_tapes": (250, "Cassette Tapes — magnetic tape recordings used for audio playback."),
    "catalogs": (200, "Catalogs — printed listings showcasing products or collections."),
    "cd_cases": (100, "CD Cases — protective cases designed for storing compact discs."),
    "cd_players": (2500, "CD Players — devices used to play audio compact discs."),
    "childrens_books": (300, "Children's Books — books designed for young readers with engaging stories."),
    "childrens_movies": (350, "Children's Movies — films designed for young audiences on disc."),
    "collectors_edition_albums": (1800, "Collector's Edition Albums — special music album editions with exclusive content."),
    "coloring_books": (200, "Coloring Books — books with illustrations designed for coloring activities."),
    "comics": (250, "Comics — illustrated story publications featuring serialized narratives."),
    "computer_books": (550, "Computer Books — books covering computer science and technology topics."),
    "cookbooks": (500, "Cookbooks — books featuring recipes and cooking guidance."),
    "dictionaries": (450, "Dictionaries — reference books defining words and their meanings."),
    "document_holders": (350, "Document Holders — folders used to organize and protect important documents."),
    "documentary_dvds": (450, "Documentary DVDs — factual films available on disc for home viewing."),
    "drum_sticks": (450, "Drum Sticks — a pair of sticks used for playing drums and percussion."),
    "dvd_cases": (100, "DVD Cases — protective cases designed for storing DVDs."),
    "dvd_movies": (400, "DVD Movies — films available on standard-definition DVD discs."),
    "dvd_players": (3500, "DVD Players — devices used to play standard-definition DVD discs."),
    "e_books": (250, "E-Books — digital books available for reading on electronic devices."),
    "earbuds": (900, "Earbuds — compact in-ear headphones used for personal audio listening."),
    "educational_books": (450, "Educational Books — books designed to support structured learning."),
    "educational_posters": (250, "Educational Posters — printed visual aids designed for learning environments."),
    "educational_videos": (400, "Educational Videos — instructional video content designed for learning."),
    "encyclopedias": (1500, "Encyclopedias — comprehensive reference books covering a broad range of topics."),
    "engineering_books": (700, "Engineering Books — technical books covering engineering disciplines."),
    "exam_preparation_books": (500, "Exam Preparation Books — study guides designed to help prepare for exams."),
    "external_hard_drives": (4500, "External Hard Drives — portable storage devices used for saving digital files."),
    "fiction_books": (400, "Fiction Books — imaginative narrative books spanning various genres."),
    "file_organizers": (450, "File Organizers — storage tools used to organize documents and papers."),
    "finance_books": (550, "Finance Books — books covering personal finance and investment topics."),
    "flash_cards": (250, "Flash Cards — printed learning cards used for memorization and study."),
    "graphic_novels": (500, "Graphic Novels — long-form illustrated storytelling in book format."),
    "guitar_picks": (100, "Guitar Picks — small tools used to pluck or strum guitar strings."),
    "guitar_strings": (450, "Guitar Strings — replacement strings used for acoustic or electric guitars."),
    "headphone_amplifiers": (2200, "Headphone Amplifiers — devices used to boost audio signal for headphones."),
    "headphones": (900, "Headphones — audio devices worn over or in the ears for personal listening."),
    "history_books": (500, "History Books — books covering historical events and eras."),
    "instrument_cases": (2200, "Instrument Cases — protective cases designed for carrying musical instruments."),
    "instrument_learning_books": (500, "Instrument Learning Books — instructional books for learning to play musical instruments."),
    "journals": (350, "Journals — blank notebooks used for writing and personal reflection."),
    "language_learning_books": (500, "Language Learning Books — books designed to teach a new language."),
    "law_books": (900, "Law Books — reference and textbooks covering legal studies."),
    "learning_charts": (250, "Learning Charts — printed educational charts used for visual learning."),
    "limited_edition_books": (1500, "Limited Edition Books — special printed editions with exclusive features."),
    "magazine_holders": (400, "Magazine Holders — storage units designed for organizing magazines."),
    "magazines": (200, "Magazines — periodic publications covering various topics."),
    "manga": (300, "Manga — Japanese-style comic books featuring serialized stories."),
    "medical_books": (900, "Medical Books — textbooks and reference material covering medical studies."),
    "memory_cards": (900, "Memory Cards — portable storage cards used in cameras and devices."),
    "metronomes": (700, "Metronomes — devices used to keep a steady tempo while practicing music."),
    "microphones": (2200, "Microphones — audio devices used for recording and amplifying sound."),
    "movie_posters": (350, "Movie Posters — printed promotional posters for films."),
    "mp3_players": (2500, "MP3 Players — portable devices used for playing digital audio files."),
    "music_dvds": (450, "Music DVDs — concert and music video content available on DVD."),
    "music_posters": (350, "Music Posters — printed promotional posters for musicians and bands."),
    "music_stands": (900, "Music Stands — adjustable stands used to hold sheet music while playing."),
    "musical_instruction_books": (500, "Musical Instruction Books — guides designed to teach music theory and technique."),
    "newspapers": (25, "Newspapers — printed periodicals covering current news and events."),
    "non_fiction_books": (450, "Non-Fiction Books — factual books covering real events and topics."),
    "novels": (400, "Novels — long-form fictional narrative books."),
    "periodicals": (200, "Periodicals — regularly published magazines or journals."),
    "photography_books": (900, "Photography Books — books showcasing photographic artwork and techniques."),
    "planners": (400, "Planners — printed organizers used for scheduling and task management."),
    "poetry_books": (400, "Poetry Books — books featuring collections of poems."),
    "portable_music_players": (2500, "Portable Music Players — compact devices used for playing music on the go."),
    "practice_test_books": (500, "Practice Test Books — books containing sample exams for test preparation."),
    "programming_books": (700, "Programming Books — technical books covering coding and software development."),
    "reading_lamps": (900, "Reading Lamps — adjustable lamps designed for comfortable reading light."),
    "reference_books": (600, "Reference Books — books used for looking up facts and information."),
    "religious_books": (400, "Religious Books — books covering spiritual and religious teachings."),
    "science_books": (550, "Science Books — books covering scientific topics and discoveries."),
    "self_help_books": (450, "Self-Help Books — books offering guidance for personal growth and development."),
    "sheet_music": (300, "Sheet Music — printed musical notation for performing songs."),
    "sheet_music_holders": (600, "Sheet Music Holders — stands or folders used to hold sheet music."),
    "signed_books": (2500, "Signed Books — books autographed by their author, valued by collectors."),
    "songbooks": (450, "Songbooks — collections of song lyrics and musical notation."),
    "soundbars": (5500, "Soundbars — compact speaker systems used to enhance audio for home entertainment."),
    "speakers": (2500, "Speakers — audio devices used to amplify and project sound."),
    "storage_boxes": (700, "Storage Boxes — boxes designed for organizing books and media items."),
    "technology_books": (600, "Technology Books — books covering topics in modern technology."),
    "textbooks": (700, "Textbooks — educational books used for structured academic study."),
    "training_videos": (400, "Training Videos — instructional video content designed for skill development."),
    "travel_books": (500, "Travel Books — guidebooks covering destinations and travel tips."),
    "tuners": (900, "Tuners — devices used to tune musical instruments accurately."),
    "turntables": (6500, "Turntables — devices used to play vinyl records."),
    "tv_series_box_sets": (900, "TV Series Box Sets — complete season collections of television series on disc."),
    "usb_flash_drives": (700, "USB Flash Drives — portable storage devices used for transferring digital files."),
    "vintage_vinyl_records": (1500, "Vintage Vinyl Records — classic vinyl records valued for their age and rarity."),
    "vinyl_records": (900, "Vinyl Records — analog music recordings played on a turntable."),
    "voice_recorders": (1800, "Voice Recorders — devices used to capture and store audio recordings."),
    "workbooks": (350, "Workbooks — practice books designed for guided learning exercises."),
}

path = "data/products-placeholder.json"
with open(path, "r", encoding="utf-8") as f:
    data = json.load(f)

updated = 0
skipped = []
for sku, prod in data.items():
    if prod.get("categoryId") == "books_media_music":
        img = prod["images"]["main"].split("/")[-1].replace(".png", "")
        if img in price_desc:
            price, desc = price_desc[img]
            title = " ".join(w.capitalize() for w in img.split("_"))
            prod["title"] = title
            prod["price"] = price
            prod["description"] = desc
            prod["status"] = "active"
            updated += 1
        else:
            skipped.append((sku, img))

with open(path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Updated: {updated}")
print(f"Skipped: {skipped}")
