# -*- coding: utf-8 -*-
import sys
import os
import json

sys.stdout.reconfigure(encoding='utf-8')

# Import modules from build_full_curriculum
from build_full_curriculum import ALL_MODULES, MODULE_8_DATA, MODULE_9_DATA, MODULE_10_DATA, MODULE_11_DATA

# 1. GENERATE src/lib/medpath-data.ts
def generate_medpath_data():
    output_path = r"src/lib/medpath-data.ts"
    
    # Calculate stats for disciplines
    disciplines_code = []
    for mod in ALL_MODULES:
        total_chaps = len(mod["chapters"])
        total_les = sum(len(c["lessons"]) for c in mod["chapters"])
        completed_les = sum(sum(1 for l in c["lessons"] if l.get("status") == "completed") for c in mod["chapters"])
        mastery = round((completed_les / total_les) * 100) if total_les > 0 else 70
        completed_chaps = sum(1 for c in mod["chapters"] if all(l.get("status") == "completed" for l in c["lessons"]))
        
        # icon
        icon_map = {
            "mod-8": "HeartPulse",
            "mod-9": "Layers",
            "mod-10": "Activity",
            "mod-11": "Brain"
        }
        
        disciplines_code.append(f"""  {{
    id: {json.dumps(mod['id'])},
    name: {json.dumps(mod['name'])},
    latinName: {json.dumps(mod['latin'])},
    code: {json.dumps(mod['code'])},
    iconName: {json.dumps(icon_map.get(mod['id'], 'Activity'))},
    totalChapters: {total_chaps},
    completedChapters: {completed_chaps},
    masteryPercentage: {mastery},
    color: {json.dumps(mod['color'])},
    description: {json.dumps(f"Toàn bộ chương trình đào tạo {mod['name']} gồm {total_les} bài giảng (Lý thuyết & Thực hành) theo lịch huấn luyện DY18A.")},
    currentTopic: {json.dumps(mod['chapters'][0]['lessons'][0]['title'])},
  }},""")

    disciplines_str = "\n".join(disciplines_code)

    def format_chapters(chapters, disc_id):
        chaps_code = []
        for c_idx, chap in enumerate(chapters):
            lessons_code = []
            c_lessons = chap["lessons"]
            comp_count = sum(1 for l in c_lessons if l.get("status") == "completed")
            c_progress = round((comp_count / len(c_lessons)) * 100) if len(c_lessons) > 0 else 0
            if c_progress == 100:
                c_status = "completed"
            elif c_progress > 0:
                c_status = "in_progress"
            else:
                c_status = "not_started"

            for l_idx, les in enumerate(c_lessons):
                les_id = f"les-{disc_id.replace('mod-', '')}-{c_idx+1}-{l_idx+1}"
                score_str = f"score: {les['score']}," if "score" in les else ""
                lessons_code.append(f"""      {{
        id: {json.dumps(les_id)},
        chapterId: {json.dumps(chap['id'])},
        code: {json.dumps(les['code'])},
        title: {json.dumps(les['title'])},
        latinTitle: {json.dumps(f"{les['latin']} [{les['dept']}]")},
        estimatedMinutes: {les['min']},
        questionCount: {les['questions']},
        status: {json.dumps(les.get('status', 'not_started'))},
        {score_str}
        threshold: 80,
        objectives: {json.dumps(les['objectives'], ensure_ascii=False)},
        clinicalHighlights: {json.dumps(les['clinical'], ensure_ascii=False)},
        keyTerms: {json.dumps(les['terms'], ensure_ascii=False)},
      }},""")

            lessons_str = "\n".join(lessons_code)
            chaps_code.append(f"""  {{
    id: {json.dumps(chap['id'])},
    disciplineId: {json.dumps(disc_id)},
    romanNumeral: {json.dumps(chap['roman'])},
    title: {json.dumps(chap['title'])},
    latinTitle: {json.dumps(chap['latin'])},
    totalLessons: {len(c_lessons)},
    completedLessons: {comp_count},
    progress: {c_progress},
    status: {json.dumps(c_status)},
    lessons: [
{lessons_str}
    ],
  }},""")
        return "\n".join(chaps_code)

    mod_8_str = format_chapters(MODULE_8_DATA["chapters"], "mod-8")
    mod_9_str = format_chapters(MODULE_9_DATA["chapters"], "mod-9")
    mod_10_str = format_chapters(MODULE_10_DATA["chapters"], "mod-10")
    mod_11_str = format_chapters(MODULE_11_DATA["chapters"], "mod-11")

    # Read knowledge gate questions and analytics from existing file
    with open("src/lib/medpath-data.ts", "r", encoding="utf-8") as f:
        old_data = f.read()

    # extract KNOWLEDGE_GATE_QUESTIONS
    kg_start = old_data.find("export const KNOWLEDGE_GATE_QUESTIONS")
    kg_end = old_data.find("export const ACADEMIC_ANALYTICS_DATA")
    kg_part = old_data[kg_start:kg_end].strip()

    analytics_part = old_data[kg_end:].strip()

    ts_content = f"""// MEDPATH — Academic Data Store & Medical Knowledge Seed
// Exhaustive curriculum: 79 lessons across Module 8, 9, 10, 11 (DY18A)

export interface Discipline {{
  id: string;
  name: string;
  latinName: string;
  code: string;
  iconName: string;
  totalChapters: number;
  completedChapters: number;
  masteryPercentage: number;
  color: string;
  description: string;
  currentTopic: string;
}}

export interface Chapter {{
  id: string;
  disciplineId: string;
  romanNumeral: string;
  title: string;
  latinTitle: string;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  status: "completed" | "in_progress" | "review_needed" | "not_started";
  lessons: Lesson[];
}}

export interface Lesson {{
  id: string;
  chapterId: string;
  code: string;
  title: string;
  latinTitle: string;
  estimatedMinutes: number;
  questionCount: number;
  status: "completed" | "in_progress" | "review_needed" | "not_started";
  score?: number;
  threshold: number;
  objectives: string[];
  clinicalHighlights: string[];
  keyTerms: string[];
}}

export interface StudyTask {{
  id: string;
  title: string;
  type: "reading" | "quiz" | "review" | "case_study";
  subject: string;
  dueTime: string;
  completed: boolean;
  estimatedMin: number;
}}

export interface GateQuestion {{
  id: number;
  type: "single" | "clinical_case";
  vignette?: string;
  question: string;
  latinContext?: string;
  imageCaption?: string;
  imageType?: "anatomy" | "clinical";
  options: {{
    id: "A" | "B" | "C" | "D";
    text: string;
    isCorrect: boolean;
    explanation: string;
  }}[];
  reference: string;
  topicTag: string;
  difficulty: "Cơ bản" | "Vận dụng" | "Lâm sàng cao";
}}

// 4 Module học tích hợp theo lịch huấn luyện chính thức (Lớp DY18A)
export const MEDPATH_DISCIPLINES: Discipline[] = [
{disciplines_str}
];

// Danh sách nhiệm vụ học tập hôm nay
export const TODAY_STUDY_TASKS: StudyTask[] = [
  {{
    id: "task-1",
    title: "Module 11: Đọc mục IV — Các ngành và bó tận đám rối cánh tay (Plexus brachialis)",
    type: "reading",
    subject: "Module 11 - Thần kinh",
    dueTime: "11:30",
    completed: true,
    estimatedMin: 25,
  }},
  {{
    id: "task-2",
    title: "Module 8: Hoàn thành Knowledge Gate — LT1 & LT3: Hình thái & Chu kỳ tim (Mục tiêu ≥80%)",
    type: "quiz",
    subject: "Module 8 - Tim mạch",
    dueTime: "14:00",
    completed: false,
    estimatedMin: 20,
  }},
  {{
    id: "task-3",
    title: "Module 9: Spaced Repetition — Phân đoạn gan Couinaud & Hệ tuần hoàn tĩnh mạch cửa",
    type: "review",
    subject: "Module 9 - Tiêu hoá",
    dueTime: "16:30",
    completed: false,
    estimatedMin: 15,
  }},
  {{
    id: "task-4",
    title: "Module 10: Ca lâm sàng — Phân tích cơ chế suy thận cấp trước thận vs hoại tử ống thận cấp",
    type: "case_study",
    subject: "Module 10 - Tiết niệu,sinh dục",
    dueTime: "20:00",
    completed: false,
    estimatedMin: 30,
  }},
];

// ==========================================
// MODULE 8: TIM MẠCH (16 BÀI: 11 LT + 5 TH)
// ==========================================
export const MODULE_8_CHAPTERS: Chapter[] = [
{mod_8_str}
];

// ==========================================
// MODULE 9: TIÊU HOÁ (18 BÀI: 12 LT + 6 TH)
// ==========================================
export const MODULE_9_CHAPTERS: Chapter[] = [
{mod_9_str}
];

// ==========================================
// MODULE 10: TIẾT NIỆU, SINH DỤC (23 BÀI: 15 LT + 8 TH)
// ==========================================
export const MODULE_10_CHAPTERS: Chapter[] = [
{mod_10_str}
];

// ==========================================
// MODULE 11: THẦN KINH (22 BÀI: 13 LT + 9 TH)
// ==========================================
export const MODULE_11_CHAPTERS: Chapter[] = [
{mod_11_str}
];

// Tổng hợp modules cho tất cả 4 Module chính thức
export const ALL_DISCIPLINE_MODULES: Record<string, Chapter[]> = {{
  "mod-8": MODULE_8_CHAPTERS,
  "mod-9": MODULE_9_CHAPTERS,
  "mod-10": MODULE_10_CHAPTERS,
  "mod-11": MODULE_11_CHAPTERS,
  // Backward compatibility aliases
  anat: MODULE_11_CHAPTERS,
  physio: MODULE_8_CHAPTERS,
  biochem: MODULE_9_CHAPTERS,
  histo: MODULE_10_CHAPTERS,
}};

// Backward-compatibility exports
export const ANATOMY_CHAPTERS = MODULE_11_CHAPTERS;
export const PHYSIOLOGY_CHAPTERS = MODULE_8_CHAPTERS;
export const BIOCHEMISTRY_CHAPTERS = MODULE_9_CHAPTERS;
export const HISTOLOGY_CHAPTERS = MODULE_10_CHAPTERS;

{kg_part}

{analytics_part}
"""

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(ts_content)
    print(f"Successfully generated {output_path} ({len(ts_content)} bytes)")


# 2. GENERATE data/medread-db.json & src/data/anatomy-seed.ts
def update_database_and_seed():
    db_path = "data/medread-db.json"
    with open(db_path, "r", encoding="utf-8") as f:
        db = json.load(f)

    class_id = "class-anat-1"

    # Define subjects
    subjects_dict = {
        "subj-mod-8": {"id": "subj-mod-8", "class_id": class_id, "title": "Module 8: Tim mạch (25.DY.K56.08)", "order": 1},
        "subj-mod-9": {"id": "subj-mod-9", "class_id": class_id, "title": "Module 9: Tiêu hoá (25.DY.K57.09)", "order": 2},
        "subj-mod-10": {"id": "subj-mod-10", "class_id": class_id, "title": "Module 10: Tiết niệu, sinh dục (25.DY.CM6.10)", "order": 3},
        "subj-mod-11": {"id": "subj-mod-11", "class_id": class_id, "title": "Module 11: Hệ thần kinh (25.DY.K55.11)", "order": 4},
        "subj-anat-1": {"id": "subj-anat-1", "class_id": class_id, "title": "Giải Phẫu Học Hệ Cơ Xương Khớp & Mạch Máu Chi Trên", "order": 5},
    }

    # Rebuild subjects array
    db["subjects"] = list(subjects_dict.values())

    # Build lessons & sections
    all_lessons = []
    all_sections = []

    # Preserve legacy sections for lesson-1 & lesson-2 if they exist
    existing_sections_map = {s["id"]: s for s in db.get("sections", [])}

    lesson_counter = 1
    for mod in ALL_MODULES:
        subj_id = f"subj-{mod['id']}"
        for chap_idx, chap in enumerate(mod["chapters"]):
            for les_idx, les in enumerate(chap["lessons"]):
                les_id = f"les-{mod['id']}-{chap_idx+1}-{les_idx+1}"
                lesson_title = f"{les['code']}: {les['title']} [{les['dept']}]"
                all_lessons.append({
                    "id": les_id,
                    "subject_id": subj_id,
                    "title": lesson_title,
                    "order": lesson_counter
                })
                lesson_counter += 1

                sec_id = f"sec-{les_id}-1"
                # Check if existing section already has custom content
                existing_sec = existing_sections_map.get(sec_id)
                if existing_sec:
                    all_sections.append(existing_sec)
                else:
                    # Create rich default editorial section template
                    content_md = f"""# {les['title']}
*Mã bài giảng*: **{les['code']}** • *Bộ môn phụ trách*: **{les['dept']}**
*Danh pháp y học*: *{les['latin']}*

---

## 🎯 1. Mục tiêu học tập (Learning Objectives)
""" + "\n".join([f"- **Mục tiêu {i+1}**: {obj}" for i, obj in enumerate(les["objectives"])]) + f"""

---

## 📖 2. Nội dung & Khung kiến thức trọng tâm
> [!NOTE] Không gian sẵn sàng nhập tài liệu
> Bài học này đã được tạo sẵn cấu trúc trong hệ thống **MEDPATH**. Bạn có thể dùng tính năng **Admin Content Studio** (`/admin`) hoặc tải lên trực tiếp tài liệu dạng **HTML / Markdown** để hiển thị trọn vẹn giáo trình tại đây.

### 2.1. Đại cương và Hình thái học
- Cấu trúc và nguyên lý cơ bản của {les['title']}.
- Liên quan giải phẫu và sinh lý chức năng theo phân loại chuẩn y khoa.

### 2.2. Cơ chế và Sinh bệnh học
- Đặc điểm dẫn truyền, điều hòa và biến đổi vi thể.
- Cơ chế tác động ở mức độ tế bào và cơ quan.

---

## 🩺 3. Điểm nhấn lâm sàng & Ứng dụng thực hành (Clinical Pearls)
""" + "\n".join([f"> [!TIP] **Lâm sàng**: {cp}" for cp in les["clinical"]]) + f"""

---

## 🔤 4. Thuật ngữ Y khoa & Danh pháp Giải phẫu (Key Terms)
""" + "\n".join([f"- `{term}`" for term in les["terms"]]) + f"""

---

## ✍️ 5. Tự lượng giá & Vượt cổng Knowledge Gate
- **Thời lượng đọc dự kiến**: {les['min']} phút.
- **Số câu hỏi trắc nghiệm**: {les['questions']} câu hỏi lâm sàng.
- **Ngưỡng đạt tiêu chuẩn**: $\\ge 80\\%$ điểm số để mở khóa bài tiếp theo.
"""
                    all_sections.append({
                        "id": sec_id,
                        "lesson_id": les_id,
                        "title": f"Mục 1: {les['title']}",
                        "order": 1,
                        "content_type": "markdown",
                        "pass_threshold": 80,
                        "questions_per_attempt": min(10, les["questions"]),
                        "is_core": True,
                        "content_url_or_text": content_md
                    })

    # Also keep legacy lessons lesson-1 & lesson-2
    all_lessons.append({"id": "lesson-1", "subject_id": "subj-anat-1", "title": "Bài 1: Xương và Khớp Chi Trên", "order": lesson_counter})
    lesson_counter += 1
    all_lessons.append({"id": "lesson-2", "subject_id": "subj-anat-1", "title": "Bài 2: Hệ Cơ và Mạch Máu - Thần Kinh Chi Trên", "order": lesson_counter})

    # add legacy sections
    for sec_id in ["sec-1-1", "sec-1-2", "sec-2-1", "sec-2-2"]:
        if sec_id in existing_sections_map and existing_sections_map[sec_id] not in all_sections:
            all_sections.append(existing_sections_map[sec_id])

    db["lessons"] = all_lessons
    db["sections"] = all_sections

    with open(db_path, "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=2)

    print(f"Successfully updated {db_path} with {len(db['subjects'])} subjects, {len(db['lessons'])} lessons, {len(db['sections'])} sections!")

    # Update src/data/anatomy-seed.ts
    seed_path = "src/data/anatomy-seed.ts"
    with open(seed_path, "r", encoding="utf-8") as f:
        seed_content = f.read()

    # replace SEED_SUBJECTS and SEED_LESSONS
    seed_subj_str = "export const SEED_SUBJECTS: Subject[] = " + json.dumps(db["subjects"], ensure_ascii=False, indent=2) + ";"
    seed_les_str = "export const SEED_LESSONS: Lesson[] = " + json.dumps(db["lessons"], ensure_ascii=False, indent=2) + ";"

    # find indexes
    s_start = seed_content.find("export const SEED_SUBJECTS: Subject[] =")
    l_start = seed_content.find("export const SEED_LESSONS: Lesson[] =")
    sec_start = seed_content.find("export const SEED_SECTIONS: Section[] =")

    if s_start != -1 and l_start != -1 and sec_start != -1:
        prefix = seed_content[:s_start]
        suffix = seed_content[sec_start:]
        new_seed_content = f"{prefix}{seed_subj_str}\n\n{seed_les_str}\n\n{suffix}"
        with open(seed_path, "w", encoding="utf-8") as f:
            f.write(new_seed_content)
        print(f"Successfully updated {seed_path}!")

if __name__ == "__main__":
    generate_medpath_data()
    update_database_and_seed()
