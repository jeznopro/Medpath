# -*- coding: utf-8 -*-
"""
Script to build the full exhaustive curriculum for:
- Module 8: Tim mạch (16 bài: 11 LT + 5 TH)
- Module 9: Tiêu hóa (18 bài: 12 LT + 6 TH)
- Module 10: Tiết niệu, sinh dục (23 bài: 15 LT + 8 TH)
- Module 11: Hệ thần kinh (22 bài: 13 LT + 9 TH)
Total 79 lessons accurately mapped from LỊCH HUẤN LUYỆN LỚP DY18A.
"""

import json

# Define the lessons for each module
MODULE_8_DATA = {
    "id": "mod-8",
    "name": "Module 8 - Tim mạch",
    "latin": "Systema Cardiovasculare (25.DY.K56.08)",
    "code": "MOD-08",
    "color": "#782F3B",
    "chapters": [
        {
            "id": "mod-8-chap-1",
            "roman": "PHẦN I",
            "title": "Hình thái & Cấu trúc Giải phẫu - Mô phôi Tim mạch",
            "latin": "Morphologia & Histologia Cardiaca",
            "lessons": [
                {
                    "code": "K56.LT1",
                    "title": "LT1. Hình thái của tim",
                    "dept": "Bộ môn Giải phẫu",
                    "latin": "Cor & Morfologia cordis externa et interna",
                    "min": 30, "questions": 20, "score": 92, "status": "completed",
                    "objectives": ["Mô tả hình thể ngoài của tim: đỉnh, đáy, 3 mặt", "Hình thể trong 4 buồng tim và các van tim", "Hệ thống động mạch vành và tĩnh mạch tim"],
                    "clinical": ["Nhồi máu cơ tim theo nhánh động mạch vành", "Tiếng tim và tiếng thổi cơ năng/thực thể"],
                    "terms": ["Apex cordis", "Ventriculus sinister", "Arteria coronaria", "Valva atrioventricularis"]
                },
                {
                    "code": "K56.LT2",
                    "title": "LT2. Mô học hệ thống tim mạch",
                    "dept": "Bộ môn Mô phôi",
                    "latin": "Histologia systematis cardiovascularis",
                    "min": 25, "questions": 16, "score": 88, "status": "completed",
                    "objectives": ["Cấu trúc vi thể 3 lớp thành tim: Nội tâm mạc, cơ tim, ngoại tâm mạc", "Đặc điểm đĩa gian bào và liên kết khe", "Hệ thống nút tự động phát nhịp (SA, AV, Purkinje)"],
                    "clinical": ["Viêm nội tâm mạc nhiễm khuẩn", "Bệnh cơ tim phì đại di truyền"],
                    "terms": ["Endocardium", "Myocardium", "Discus intercalatus", "Nodus sinuatrialis"]
                },
                {
                    "code": "K56.LT4",
                    "title": "LT4. Giải phẫu và cấu trúc hệ mạch máu",
                    "dept": "Bộ môn Giải phẫu",
                    "latin": "Anatomia et structura systematis vascularis",
                    "min": 30, "questions": 18, "score": 85, "status": "completed",
                    "objectives": ["Động mạch chủ và các nhánh lớn", "Hệ tĩnh mạch chủ trên, dưới và hệ tĩnh mạch đơn", "Cấu trúc vi thể thành động mạch, mao mạch, tĩnh mạch"],
                    "clinical": ["Phình tách động mạch chủ ngực", "Xơ vữa thành mạch và tắc mạch cấp tính"],
                    "terms": ["Aorta thoracica", "Vena cava superior", "Tunica intima", "Tunica media"]
                },
                {
                    "code": "K56.TH1",
                    "title": "TH1. Hình thái tim",
                    "dept": "Bộ môn Giải phẫu",
                    "latin": "Practica: Morphologia cordis",
                    "min": 45, "questions": 15, "score": 90, "status": "completed",
                    "objectives": ["Thực hành xác định các mốc giải phẫu trên mô hình tim", "Nhận diện lỗ nhĩ thất, các lá van tim và van tổ chim", "Chỉ đường đi động mạch vành phải và trái trên tiêu bản"],
                    "clinical": ["Kỹ thuật chọc dò dịch màng ngoài tim góc ức - mũi kiếm"],
                    "terms": ["Pericardium", "Sinus coronarius", "Trabeculae carneae"]
                },
                {
                    "code": "K56.TH3",
                    "title": "TH3. Giải phẫu mạch máu",
                    "dept": "Bộ môn Giải phẫu",
                    "latin": "Practica: Anatomia vascularis",
                    "min": 45, "questions": 15, "score": 88, "status": "completed",
                    "objectives": ["Bộc lộ và gọi tên các động mạch lớn trên xác và mô hình", "Tìm các nhánh của cung động mạch chủ và động mạch chi", "Nhận biết các vòng nối mạch máu quan trọng"],
                    "clinical": ["Vị trí bắt mạch quay, mạch cảnh, mạch mu chân", "Vị trí đặt catheter tĩnh mạch trung tâm"],
                    "terms": ["Arteria carotis communis", "Arteria femoralis", "Arteria radialis"]
                }
            ]
        },
        {
            "id": "mod-8-chap-2",
            "roman": "PHẦN II",
            "title": "Sinh lý Tim mạch & Huyết động học",
            "latin": "Physiologia Cardiaca & Hemodynamica",
            "lessons": [
                {
                    "code": "K56.LT3",
                    "title": "LT3. Chức năng và các hoạt động chức năng của tim",
                    "dept": "Bộ môn Sinh lý thường",
                    "latin": "Functio cordis et cyclus cardiacus",
                    "min": 35, "questions": 22, "score": 85, "status": "completed",
                    "objectives": ["Phân tích chu kỳ tim và các thời kỳ tâm thu, tâm trương", "Đường cong Wiggers về áp suất buồng tim và động mạch chủ", "Điện tâm đồ (ECG) chuẩn và các sóng P, QRS, T"],
                    "clinical": ["Cơ chế tiếng T1, T2 và các tiếng tim bệnh lý T3, T4", "Đánh giá phân suất tống máu thất trái (EF%)"],
                    "terms": ["Systole", "Diastole", "Wiggers diagram", "Ejection fraction"]
                },
                {
                    "code": "K56.LT5",
                    "title": "LT5. Tuần hoàn mạch máu và điều tiết tuần hoàn",
                    "dept": "Bộ môn Sinh lý thường",
                    "latin": "Circulatio sanguinis et regulatio hemodynamica",
                    "min": 35, "questions": 20, "status": "in_progress",
                    "objectives": ["Huyết áp động mạch và các yếu tố ảnh hưởng", "Cơ chế điều hòa thần kinh qua thụ thể áp suất và hóa cảm thụ quan", "Điều hòa thể tích tuần hoàn qua hệ RAA và ANP"],
                    "clinical": ["Phản xạ nhịp nhanh trong hạ huyết áp tư thế", "Nguyên lý đo huyết áp gián tiếp Korotkoff"],
                    "terms": ["Baroreceptor", "Poiseuille law", "Renin-angiotensin", "Afterload"]
                },
                {
                    "code": "K56.TH2",
                    "title": "TH2. Chức năng và hoạt động chức năng của tim",
                    "dept": "Bộ môn Sinh lý thường",
                    "latin": "Practica: Functio cordis & ECG",
                    "min": 45, "questions": 15, "score": 84, "status": "completed",
                    "objectives": ["Thực hành ghi và đọc điện tâm đồ 12 chuyển đạo", "Đo các khoảng PQ, QRS, QT và tính tần số tim", "Nghe và nhận định tiếng tim trên người khỏe mạnh"],
                    "clinical": ["Phát hiện thiếu máu cục bộ cơ tim trên ST chênh", "Đo huyết áp và làm nghiệm pháp gắng sức"],
                    "terms": ["ECG 12 leads", "QT interval", "Auscultatio cordis"]
                },
                {
                    "code": "K56.TH4",
                    "title": "TH4. Tuần hoàn mạch máu và điều tiết tuần hoàn",
                    "dept": "Bộ môn Sinh lý thường",
                    "latin": "Practica: Regulatio hemodynamica",
                    "min": 45, "questions": 15, "status": "in_progress",
                    "objectives": ["Thực nghiệm đo lưu lượng và sức cản mạch máu", "Thăm dò phản xạ áp thụ quan xoang cảnh", "Đánh giá biến thiên huyết áp theo tư thế và nhịp thở"],
                    "clinical": ["Theo dõi chỉ số huyết động xâm lấn", "Nghiệm pháp Valsalva"],
                    "terms": ["Valsalva maneuver", "Sinus caroticus", "Systemic vascular resistance"]
                }
            ]
        },
        {
            "id": "mod-8-chap-3",
            "roman": "PHẦN III",
            "title": "Sinh lý bệnh & Giải phẫu bệnh Tim mạch",
            "latin": "Pathophysiologia & Pathologia Cardiovascularis",
            "lessons": [
                {
                    "code": "K56.LT6",
                    "title": "LT6. Rối loạn hình thái và chức năng tim",
                    "dept": "Bộ môn Sinh lý bệnh",
                    "latin": "Perturbationes morphologiae et functionis cordis",
                    "min": 35, "questions": 20, "score": 80, "status": "completed",
                    "objectives": ["Sinh lý bệnh suy tim tâm thu vs suy tim tâm trương", "Cơ chế phì đại và giãn buồng tim thích nghi", "Bệnh học thiếu máu cục bộ và nhồi máu cơ tim cấp"],
                    "clinical": ["Phân độ suy tim NYHA và giai đoạn theo AHA/ACC", "Men tim Troponin siêu nhạy"],
                    "terms": ["Insuficientia cordis", "Infarctus myocardii", "Remodeling", "NYHA classification"]
                },
                {
                    "code": "K56.LT7",
                    "title": "LT7. Rối loạn lưu lượng tuần hoàn",
                    "dept": "Bộ môn Sinh lý bệnh",
                    "latin": "Perturbatio fluxus sanguinis & Schock",
                    "min": 30, "questions": 18, "score": 72, "status": "review_needed",
                    "objectives": ["Cơ chế bệnh sinh tăng huyết áp nguyên phát và thứ phát", "Phân loại 4 nhóm sốc tuần hoàn (tim, giảm thể tích, phân bố, tắc nghẽn)", "Rối loạn vi tuần hoàn và thiếu oxy tế bào"],
                    "clinical": ["Xử trí bù dịch và vận mạch trong sốc", "Lactate máu đánh giá tưới máu mô"],
                    "terms": ["Hypertensio arterialis", "Schock", "Lactatemia", "Microcirculatio"]
                },
                {
                    "code": "K56.LT9",
                    "title": "LT9. Rối loạn hình thái và chức năng động mạch",
                    "dept": "Bộ môn Giải phẫu bệnh",
                    "latin": "Pathologia arteriarum & Atherosclerosis",
                    "min": 30, "questions": 16, "status": "not_started",
                    "objectives": ["Bệnh sinh mảng vữa xơ động mạch và các giai đoạn tiến triển", "Biến chứng nứt vỡ mảng xơ vữa và huyết khối tắc mạch", "Viêm mạch máu (Vasculitis) và thoái hóa thành mạch"],
                    "clinical": ["Bệnh động mạch ngoại biên (PAD) và chỉ số ABI", "Chụp mạch số hóa xóa nền DSA"],
                    "terms": ["Atherosclerosis", "Thrombosis arterialis", "Vasculitis", "Plaque rupture"]
                },
                {
                    "code": "K56.LT10",
                    "title": "LT10. Rối loạn hình thái và chức năng tĩnh mạch",
                    "dept": "Bộ môn Giải phẫu bệnh",
                    "latin": "Pathologia venarum & Thrombosis",
                    "min": 25, "questions": 15, "status": "not_started",
                    "objectives": ["Suy van tĩnh mạch chi dưới và giãn tĩnh mạch nông", "Huyết khối tĩnh mạch sâu chi dưới (DVT)", "Tam chứng Virchow trong sinh bệnh học huyết khối tĩnh mạch"],
                    "clinical": ["Thang điểm Wells đánh giá DVT và thuyên tắc phổi PE", "Siêu âm Doppler mạch máu"],
                    "terms": ["Thrombosis venosa profunda", "Embolia pulmonalis", "Trias Virchow", "Varices"]
                },
                {
                    "code": "K56.TH5",
                    "title": "TH5. Rối loạn lưu lượng tuần hoàn",
                    "dept": "Bộ môn Sinh lý bệnh",
                    "latin": "Practica: Pathophysiologia circulationis",
                    "min": 45, "questions": 15, "status": "review_needed",
                    "objectives": ["Thực nghiệm gây sốc mất máu trên động vật thí nghiệm", "Quan sát rối loạn vi tuần hoàn mạc treo", "Phân tích biến đổi huyết áp và nhịp tim trong các pha của sốc"],
                    "clinical": ["Mô hình hồi sức sốc mất máu", "Theo dõi áp lực tĩnh mạch trung tâm CVP"],
                    "terms": ["Animal experiment", "Hemorrhagic shock", "Capillary refill time"]
                }
            ]
        },
        {
            "id": "mod-8-chap-4",
            "roman": "PHẦN IV",
            "title": "Dược lý Hệ Tim mạch",
            "latin": "Pharmacologia Cardiovascularis",
            "lessons": [
                {
                    "code": "K56.LT8",
                    "title": "LT8. Các thuốc tác động lên tim",
                    "dept": "Viện đào tạo dược",
                    "latin": "Medicamenta cardiaca",
                    "min": 35, "questions": 20, "status": "not_started",
                    "objectives": ["Glycosid trợ tim (Digoxin): cơ chế ức chế Na+/K+ ATPase", "Thuốc chẹn Beta giao cảm: phân loại chọn lọc β1 và không chọn lọc", "Thuốc chống loạn nhịp tim theo phân loại Vaughan-Williams"],
                    "clinical": ["Dấu hiệu ngộ độc Digoxin trên ECG và hạ kali máu", "Chống chỉ định chẹn beta trong hen phế quản"],
                    "terms": ["Digoxin", "Beta-blocker", "Amiodarone", "Inotrope"]
                },
                {
                    "code": "K56.LT11",
                    "title": "LT11. Các thuốc tác động lên hệ mạch máu",
                    "dept": "Viện đào tạo dược",
                    "latin": "Medicamenta vascularia & Antihypertensiva",
                    "min": 30, "questions": 18, "status": "not_started",
                    "objectives": ["Thuốc ức chế men chuyển (ACEi) và chẹn thụ thể ARB", "Thuốc chẹn kênh calci DHP và Non-DHP", "Thuốc giãn mạch nhóm Nitrat hữu cơ và thuốc chẹn alpha"],
                    "clinical": ["Tác dụng phụ ho khan do tích tụ bradykinin của ACEi", "Hạ huyết áp liều đầu của thuốc giãn mạch"],
                    "terms": ["Enalapril", "Losartan", "Amlodipine", "Nitroglycerin"]
                }
            ]
        }
    ]
}

MODULE_9_DATA = {
    "id": "mod-9",
    "name": "Module 9 - Tiêu hoá",
    "latin": "Systema Digestorium (25.DY.K57.09)",
    "code": "MOD-09",
    "color": "#B67A36",
    "chapters": [
        {
            "id": "mod-9-chap-1",
            "roman": "PHẦN I",
            "title": "Giải phẫu & Mô phôi Ống Tiêu hóa & Tuyến Tiêu hóa",
            "latin": "Anatomia & Histologia Systematis Digestorii",
            "lessons": [
                {
                    "code": "K57.LT1",
                    "title": "LT1. Giải phẫu ống tiêu hóa",
                    "dept": "Bộ môn Giải phẫu",
                    "latin": "Anatomia canalis alimentarii",
                    "min": 35, "questions": 22, "score": 90, "status": "completed",
                    "objectives": ["Giải phẫu thực quản, dạ dày và các bờ cong", "Khung tá tràng và các đoạn hỗng tràng, hồi tràng", "Đặc điểm hình thái manh tràng, ruột thừa, đại tràng và trực tràng"],
                    "clinical": ["Điểm ruột thừa McBurney trong viêm ruột thừa cấp", "Thủng loét hành tá tràng vào động mạch vị tá tràng"],
                    "terms": ["Gaster", "Duodenum", "Caecum", "Appendix vermiformis", "Taenia coli"]
                },
                {
                    "code": "K57.LT2",
                    "title": "LT2. Giải phẫu các tuyến tiêu hóa",
                    "dept": "Bộ môn Giải phẫu",
                    "latin": "Glandulae digestoriae: Hepar & Pancreas",
                    "min": 30, "questions": 20, "score": 86, "status": "completed",
                    "objectives": ["Phân chia phân thùy gan theo Couinaud dựa trên tĩnh mạch cửa", "Đường dẫn mật ngoài gan: ống gan, ống mật chủ, túi mật", "Giải phẫu tụy và liên quan với tá tràng, mạch máu mạc treo"],
                    "clinical": ["Tam giác túi mật Calot và phẫu thuật cắt túi mật", "Tam chứng Charcot trong sỏi ống mật chủ"],
                    "terms": ["Hepar", "Vesica biliaris", "Ductus choledochus", "Pancreas", "Trigonum Calot"]
                },
                {
                    "code": "K57.LT3",
                    "title": "LT3. Phôi thai hệ tiêu hóa và mô học thành ống tiêu hoá chính thức",
                    "dept": "Bộ môn Mô phôi",
                    "latin": "Embryologia et histologia canalis alimentarii",
                    "min": 30, "questions": 18, "score": 88, "status": "completed",
                    "objectives": ["Sự phát triển phôi thai ruột trước, ruột giữa, ruột sau", "Cấu trúc 4 tầng mô học: niêm mạc, dưới niêm mạc, cơ, thanh mạc", "Đám rối thần kinh Auerbach và Meissner"],
                    "clinical": ["Dị tật teo ruột bẩm sinh, phình đại tràng Hirschsprung", "Túi thừa Meckel do tồn tại ống noãn hoàng"],
                    "terms": ["Plexus myentericus", "Plexus submucosus", "Meckel diverticulum"]
                },
                {
                    "code": "K57.LT4",
                    "title": "LT4. Mô học các đoạn ống tiêu hoá và tuyến tiêu hoá",
                    "dept": "Bộ môn Mô phôi",
                    "latin": "Histologia segmentorum et glandularum",
                    "min": 30, "questions": 18, "score": 85, "status": "completed",
                    "objectives": ["Mô học tuyến dạ dày: tế bào chính, tế bào viền, tế bào nhầy", "Cấu trúc nhung mao và bờ bàn chải ruột non", "Cấu trúc vi thể tiểu thùy gan và nang tụy ngoại tiết"],
                    "clinical": ["Viêm teo dạ dày tự miễn gây thiếu vitamin B12", "Vi xơ gan và xơ hóa khoảng cửa"],
                    "terms": ["Parietal cell", "Chief cell", "Villi intestinales", "Lobulus hepaticus"]
                },
                {
                    "code": "K57.TH1",
                    "title": "TH1. Giải phẫu ổ bụng; ống tiêu hóa; phúc mạc",
                    "dept": "Bộ môn Giải phẫu",
                    "latin": "Practica: Cavitas abdominis & Peritoneum",
                    "min": 45, "questions": 15, "score": 92, "status": "completed",
                    "objectives": ["Xác định các nếp, túi và khoang phúc mạc ổ bụng", "Phân biệt tạng trong phúc mạc, ngoài phúc mạc và sau phúc mạc", "Bộc lộ các đoạn của ống tiêu hóa trên tiêu bản xác"],
                    "clinical": ["Túi cùng Douglas đọng dịch mủ hoặc máu", "Thoát vị bẹn và thoát vị thành bụng"],
                    "terms": ["Peritoneum", "Omentum majus", "Bursa omentalis", "Excavatio Douglas"]
                },
                {
                    "code": "K57.TH2",
                    "title": "TH2. Giải phẫu các tuyến tiêu hóa",
                    "dept": "Bộ môn Giải phẫu",
                    "latin": "Practica: Glandulae digestoriae",
                    "min": 45, "questions": 15, "score": 88, "status": "completed",
                    "objectives": ["Nhận diện các mặt, các bờ và rãnh chữ H của gan", "Xác định cuống gan tại mạc nối nhỏ", "Chỉ các phần đầu, thân, đuôi tụy và ống Wirsung"],
                    "clinical": ["Nghiệm pháp Pringle kẹp cuống gan cầm máu", "U đầu tụy gây tắc mật tiến triển"],
                    "terms": ["Porta hepatis", "Ligamentum hepatoduodenale", "Caput pancreatis"]
                },
                {
                    "code": "K57.TH3",
                    "title": "TH3. Mô học ống và tuyến tiêu hóa",
                    "dept": "Bộ môn Mô phôi",
                    "latin": "Practica: Histologia digestoria",
                    "min": 45, "questions": 15, "score": 86, "status": "completed",
                    "objectives": ["Soi kính hiển vi tiêu bản biểu mô lát tầng thực quản vs biểu mô trụ dạ dày", "Nhận biết tế bào đài tiết nhầy và tế bào Paneth", "Quan sát khoảng cửa gan và tiểu đảo Langerhans tụy"],
                    "clinical": ["Chẩn đoán dị sản ruột trên sinh thiết dạ dày", "Viêm gan mạn tính trên tiêu bản mô"],
                    "terms": ["Goblet cell", "Paneth cell", "Trias hepatica", "Insulae Langerhans"]
                }
            ]
        },
        {
            "id": "mod-9-chap-2",
            "roman": "PHẦN II",
            "title": "Sinh lý & Hóa sinh Hệ Tiêu hóa",
            "latin": "Physiologia & Biochemia Digestoria",
            "lessons": [
                {
                    "code": "K57.LT5",
                    "title": "LT5. Tiêu hóa ở dạ dày; Tiêu hóa và hấp thu ở ruột non",
                    "dept": "Bộ môn Sinh lý thường",
                    "latin": "Digestio gastrica et absorptio intestinalis",
                    "min": 35, "questions": 22, "score": 84, "status": "completed",
                    "objectives": ["Cơ chế bài tiết acid dịch vị qua bơm H+/K+ ATPase", "Các men tiêu hóa dịch tụy và vai trò muối mật nhũ tương hóa", "Cơ chế hấp thu glucid, protid, lipid và vitamin"],
                    "clinical": ["Hội chứng Zollinger-Ellison u tiết Gastrin", "Hội chứng kém hấp thu sau cắt đoạn ruột non"],
                    "terms": ["H+/K+ ATPase", "Gastrin", "Secretin", "Micelle", "Chylomicron"]
                },
                {
                    "code": "K57.LT9",
                    "title": "LT9. Hóa sinh hệ tiêu hóa, gan",
                    "dept": "Hóa sinh",
                    "latin": "Biochemia digestoria & Functio hepatica",
                    "min": 35, "questions": 20, "status": "in_progress",
                    "objectives": ["Chuyển hóa Bilirubin: từ thoái hóa Hb đến đào thải phân/nước tiểu", "Chức năng tổng hợp protein huyết tương của gan (Albumin, đông máu)", "Chu trình Ure giải độc Amoniac (NH3) tại gan"],
                    "clinical": ["Phân biệt vàng da trước gan, tại gan, sau gan", "Bệnh não gan do tăng NH3 trong xơ gan mất bù"],
                    "terms": ["Bilirubin directum", "Bilirubin indirectum", "Urea cycle", "Ammonia"]
                },
                {
                    "code": "K57.TH4",
                    "title": "TH4. Chức năng hệ tiêu hóa",
                    "dept": "Bộ môn Sinh lý thường",
                    "latin": "Practica: Functio digestoria",
                    "min": 45, "questions": 15, "score": 85, "status": "completed",
                    "objectives": ["Khảo sát tác dụng thủy phân tinh bột của Amylase nước bọt", "Thực nghiệm nhu động ruột cô lập thỏ (phương pháp Magnus)", "Khảo sát tác dụng co bóp của Acetylcholine và Adrenaline"],
                    "clinical": ["Thuốc kháng Cholinergic giảm co thắt cơ trơn", "Ức chế nhu động ruột do thuốc phiện"],
                    "terms": ["Magnus method", "Peristalsis", "Amylase activity"]
                },
                {
                    "code": "K57.TH6",
                    "title": "TH6. Xét nghiệm hóa sinh hệ tiêu hóa, chức năng gan",
                    "dept": "Hóa sinh",
                    "latin": "Practica: Laboratorium hepaticum",
                    "min": 45, "questions": 15, "status": "in_progress",
                    "objectives": ["Kỹ thuật định lượng Bilirubin toàn phần, trực tiếp, gián tiếp", "Định lượng enzym men gan AST (GOT) và ALT (GPT)", "Định lượng Albumin máu và tỷ lệ A/G"],
                    "clinical": ["Tỷ số De Ritis (AST/ALT) trong viêm gan rượu vs virus", "Tăng ALP và GGT trong tắc mật"],
                    "terms": ["AST", "ALT", "Alkaline phosphatase", "De Ritis ratio"]
                }
            ]
        },
        {
            "id": "mod-9-chap-3",
            "roman": "PHẦN III",
            "title": "Bệnh học, Vi sinh & Ký sinh trùng Tiêu hóa",
            "latin": "Pathologia, Microbiologia & Parasitologia",
            "lessons": [
                {
                    "code": "K57.LT6",
                    "title": "LT6. Rối loạn chức năng ống tiêu hóa",
                    "dept": "Bộ môn Sinh lý bệnh",
                    "latin": "Perturbationes functionis canalis alimentarii",
                    "min": 30, "questions": 18, "status": "in_progress",
                    "objectives": ["Cơ chế bệnh sinh loét dạ dày tá tràng: mất cân bằng tấn công vs bảo vệ", "Cơ chế tiêu chảy thẩm thấu, xuất tiết, xâm lấn và tăng nhu động", "Sinh lý bệnh nôn và tắc ruột cơ học"],
                    "clinical": ["Mất nước điện giải trong tiêu chảy cấp", "Hội chứng trào ngược dạ dày thực quản GERD"],
                    "terms": ["Ulcus pepticum", "Diarrhea", "GERD", "Ileus"]
                },
                {
                    "code": "K57.LT7",
                    "title": "LT7. Rối loạn chức năng tuyến tiêu hóa",
                    "dept": "Bộ môn Sinh lý bệnh",
                    "latin": "Perturbationes glandularum digestoriarum",
                    "min": 30, "questions": 18, "status": "in_progress",
                    "objectives": ["Sinh lý bệnh suy tế bào gan và hội chứng tăng áp lực tĩnh mạch cửa", "Cơ chế viêm tụy cấp tự tiêu do hoạt hóa sớm Trypsinogen", "Sinh bệnh học hình thành sỏi mật cholesterol và sắc tố"],
                    "clinical": ["Tuần hoàn bàng hệ cửa chủ và xuất huyết tiêu hóa", "Tiêu chuẩn chẩn đoán viêm tụy cấp Atlanta"],
                    "terms": ["Cirrhosis", "Portal hypertension", "Pancreatitis acuta", "Cholelithiasis"]
                },
                {
                    "code": "K57.LT8",
                    "title": "LT8. Giải phẫu bệnh hệ tiêu hóa",
                    "dept": "Giải phẫu bệnh",
                    "latin": "Pathologia systematis digestorii",
                    "min": 30, "questions": 18, "score": 70, "status": "review_needed",
                    "objectives": ["Mô bệnh học viêm loét dạ dày mạn tính và ung thư biểu mô tuyến", "Các giai đoạn xơ hóa gan theo thang điểm METAVIR", "Polyp đại tràng và ung thư đại trực tràng"],
                    "clinical": ["Thực quản Barrett tiền ung thư", "Tầm soát ung thư đại trực tràng bằng nội soi sinh thiết"],
                    "terms": ["Barrett esophagus", "Metaplasia intestinalis", "Adenocarcinoma", "METAVIR"]
                },
                {
                    "code": "K57.LT10",
                    "title": "LT10. Vi sinh vật thường trú và gây bệnh đường tiêu hóa",
                    "dept": "Vi sinh",
                    "latin": "Microbiologia gastrointestinalis",
                    "min": 25, "questions": 16, "status": "not_started",
                    "objectives": ["Độc lực của Helicobacter pylori (Urease, CagA, VacA)", "Vi khuẩn gây ngộ độc thức ăn: Salmonella, Shigella, E. coli sinh độc tố", "Virus viêm gan lây qua đường tiêu hóa: HAV và HEV"],
                    "clinical": ["Test thở C13 chẩn đoán H. pylori", "Viêm đại tràng giả mạc do Clostridioides difficile"],
                    "terms": ["Helicobacter pylori", "Salmonella typhi", "Shigella dysenteriae", "ETEC"]
                },
                {
                    "code": "K57.LT11",
                    "title": "LT11. Ký sinh trùng đường tiêu hóa",
                    "dept": "Ký sinh trùng",
                    "latin": "Parasitologia gastrointestinalis",
                    "min": 25, "questions": 15, "status": "not_started",
                    "objectives": ["Amip Entamoeba histolytica gây lỵ amip và áp xe gan", "Giun đũa, giun móc, giun tóc, giun kim và chu kỳ lây nhiễm", "Sán lá gan lớn (Fasciola) và sán lá gan nhỏ (Clonorchis)"],
                    "clinical": ["Áp xe gan amip mủ chocolate", "Thiếu máu thiếu sắt do giun móc"],
                    "terms": ["Entamoeba histolytica", "Ascaris lumbricoides", "Ancylostoma duodenale", "Clonorchis"]
                },
                {
                    "code": "K57.TH5",
                    "title": "TH5. Giải phẫu bệnh hệ tiêu hóa",
                    "dept": "Giải phẫu bệnh",
                    "latin": "Practica: Pathologia digestoria",
                    "min": 45, "questions": 15, "status": "review_needed",
                    "objectives": ["Đọc tiêu bản mô bệnh học loét dạ dày mạn tính", "Nhận định cấu trúc nốt tái tạo và dải xơ trong xơ gan", "Phân biệt tế bào biểu mô ung thư xâm nhập lớp cơ"],
                    "clinical": ["Báo cáo kết quả giải phẫu bệnh sinh thiết nội soi", "Đánh giá diện cắt phẫu thuật u"],
                    "terms": ["Ulcerative crater", "Cirrhotic nodule", "Malignant gland"]
                }
            ]
        },
        {
            "id": "mod-9-chap-4",
            "roman": "PHẦN IV",
            "title": "Dược lý Hệ Tiêu hóa",
            "latin": "Pharmacologia Digestoria",
            "lessons": [
                {
                    "code": "K57.LT12",
                    "title": "LT12. Các thuốc tác động lên ống tiêu hóa",
                    "dept": "Viện đào tạo dược",
                    "latin": "Medicamenta gastrointestinalia",
                    "min": 30, "questions": 18, "status": "not_started",
                    "objectives": ["Thuốc ức chế bơm proton (PPI: Omeprazole, Esomeprazole)", "Thuốc kháng thụ thể H2 (Famotidine) và thuốc trung hòa acid (Antacid)", "Phác đồ tiệt trừ H. pylori 4 thuốc có Bismuth và thuốc chống nôn"],
                    "clinical": ["Thời điểm uống PPI chuẩn trước bữa ăn sáng", "Tương tác thuốc của PPI qua enzym CYP2C19"],
                    "terms": ["Omeprazole", "Famotidine", "Bismuth subsalicylate", "Ondansetron"]
                }
            ]
        }
    ]
}

MODULE_10_DATA = {
    "id": "mod-10",
    "name": "Module 10 - Tiết niệu,sinh dục",
    "latin": "Systema Urogenitale (25.DY.CM6.10)",
    "code": "MOD-10",
    "color": "#34745B",
    "chapters": [
        {
            "id": "mod-10-chap-1",
            "roman": "PHẦN I",
            "title": "Giải phẫu & Mô phôi Hệ Tiết niệu & Sinh dục",
            "latin": "Anatomia & Histologia Urogenitalis",
            "lessons": [
                {
                    "code": "CM6.LT1",
                    "title": "LT1. Giải phẫu hệ tiết niệu",
                    "dept": "Bộ môn Giải phẫu",
                    "latin": "Anatomia systematis urinarii",
                    "min": 35, "questions": 20, "score": 94, "status": "completed",
                    "objectives": ["Vị trí sau phúc mạc và hình thể ngoài, hình thể trong của thận", "3 chỗ hẹp tự nhiên của niệu quản", "Tam giác bàng quang Lieutaud và giải phẫu niệu đạo nam vs nữ"],
                    "clinical": ["Cơn đau quặn thận do sỏi niệu quản", "Kỹ thuật đặt sonde tiểu Foley nam vs nữ"],
                    "terms": ["Ren", "Ureter", "Vesica urinaria", "Trigonum vesicae", "Urethra"]
                },
                {
                    "code": "CM6.LT2",
                    "title": "LT2. Giải phẫu cơ quan sinh dục",
                    "dept": "Bộ môn Giải phẫu",
                    "latin": "Organa genitalia masculina et feminina",
                    "min": 30, "questions": 18, "score": 86, "status": "completed",
                    "objectives": ["Giải phẫu tinh hoàn, mào tinh hoàn, thừng tinh và tuyến tiền liệt", "Giải phẫu buồng trứng, vòi tử cung, tử cung và âm đạo", "Mạch máu và thần kinh chi phối cơ quan sinh dục"],
                    "clinical": ["Xoắn tinh hoàn cấp tính cần mổ cấp cứu", "Chửa ngoài tử cung vỡ tại vòi trứng"],
                    "terms": ["Testis", "Epididymis", "Prostata", "Ovarium", "Uterus"]
                },
                {
                    "code": "CM6.LT3",
                    "title": "LT3. Định khu chậu hông, đáy chậu",
                    "dept": "Bộ môn Giải phẫu",
                    "latin": "Topographia pelvis et perinei",
                    "min": 30, "questions": 16, "score": 84, "status": "completed",
                    "objectives": ["Cấu tạo khung chậu xương và các đường kính sản khoa", "Cơ hoành chậu hông và cơ nâng hậu môn", "Các tầng đáy chậu: tam giác niệu dục và tam giác hậu môn"],
                    "clinical": ["Rách tầng sinh môn trong sinh nở và cắt khâu tầng sinh môn", "Túi cùng Douglas đọng dịch mủ"],
                    "terms": ["Pelvis", "Perineum", "Musculus levator ani", "Excavatio rectouterina"]
                },
                {
                    "code": "CM6.LT4",
                    "title": "LT4. Phôi thai và mô học hệ tiết niệu",
                    "dept": "Bộ môn Mô phôi",
                    "latin": "Embryologia et histologia urinaria",
                    "min": 25, "questions": 16, "status": "not_started",
                    "objectives": ["Sự phát triển của tiền thận, trung thận và hậu thận", "Cấu tạo mô học Nephron: cầu thận, ống lượn gần, quai Henle, ống lượn xa", "Biểu mô niệu chuyển tiếp (Urothelium) của bàng quang"],
                    "clinical": ["Dị tật thận móng ngựa, thận đôi", "Tổn thương podocyte trong hội chứng thận hư"],
                    "terms": ["Nephron", "Glomerulus", "Podocyte", "Urothelium"]
                },
                {
                    "code": "CM6.LT5",
                    "title": "LT5. Phôi thai và mô học sinh dục",
                    "dept": "Bộ môn Mô phôi",
                    "latin": "Embryologia et histologia genitalis",
                    "min": 25, "questions": 16, "status": "not_started",
                    "objectives": ["Sự biệt hóa giới tính phôi: ống Wolff và ống Müller", "Mô học tinh hoàn: ống sinh tinh, tế bào Sertoli, tế bào Leydig", "Mô học buồng trứng: các giai đoạn phát triển của nang noãn"],
                    "clinical": ["Tinh hoàn lạc chỗ trong ổ bụng", "U nang buồng trứng dạng bì có nguồn gốc phôi thai"],
                    "terms": ["Wolffian duct", "Mullerian duct", "Sertoli cell", "Leydig cell", "Folliculus"]
                },
                {
                    "code": "CM6.TH1",
                    "title": "TH1. Giải phẫu hệ tiết niệu",
                    "dept": "Bộ môn Giải phẫu",
                    "latin": "Practica: Anatomia urinaria",
                    "min": 45, "questions": 15, "score": 90, "status": "completed",
                    "objectives": ["Chỉ các mốc giải phẫu thận: vỏ thận, tủy thận, tháp Malpighi, đài bể thận", "Theo dõi đường đi niệu quản bắt chéo động mạch chậu", "Mô tả hình thể bàng quang và niệu đạo trên tiêu bản"],
                    "clinical": ["Đọc phim chụp X-quang hệ tiết niệu KUB và UIV"],
                    "terms": ["Cortex renalis", "Medulla renalis", "Pelvis renalis", "Calyx renalis"]
                },
                {
                    "code": "CM6.TH2",
                    "title": "TH2. Hệ sinh dục nam, nữ và đáy chậu",
                    "dept": "Bộ môn Giải phẫu",
                    "latin": "Practica: Anatomia genitalis et perinei",
                    "min": 45, "questions": 15, "score": 88, "status": "completed",
                    "objectives": ["Xác định các thành phần thừng tinh và bao tinh hoàn", "Chỉ các dây chằng treo tử cung: dây chằng rộng, tròn, tử cung cùng", "Phân tích các cơ đáy chậu nông và sâu trên mô hình"],
                    "clinical": ["Thắt ống dẫn tinh triệt sản nam", "Thắt vòi tử cung triệt sản nữ"],
                    "terms": ["Funiculus spermaticus", "Ligamentum latum uteri", "Funiculus deferens"]
                },
                {
                    "code": "CM6.TH3",
                    "title": "TH3. Mô học hệ tiết niệu",
                    "dept": "Bộ môn Mô phôi",
                    "latin": "Practica: Histologia urinaria",
                    "min": 45, "questions": 15, "status": "not_started",
                    "objectives": ["Soi kính hiển vi nhận diện cầu thận Malpighi và khoang Bowman", "Phân biệt ống lượn gần (bờ bàn chải) vs ống lượn xa", "Quan sát biểu mô chuyển tiếp bàng quang lúc căng và chùng"],
                    "clinical": ["Sinh thiết thận chẩn đoán bệnh cầu thận"],
                    "terms": ["Bowman capsule", "Brush border", "Tubulus contortus"]
                },
                {
                    "code": "CM6.TH4",
                    "title": "TH4. Phôi thai và mô học hệ sinh dục",
                    "dept": "Bộ môn Mô phôi",
                    "latin": "Practica: Histologia genitalis",
                    "min": 45, "questions": 15, "status": "not_started",
                    "objectives": ["Quan sát các hàng tế bào dòng tinh trong ống sinh tinh", "Nhận biết tế bào kẽ Leydig tiết Testosterone", "Soi các giai đoạn nang trứng: nguyên thủy, sơ cấp, thứ cấp, chín De Graaf"],
                    "clinical": ["Xét nghiệm tinh dịch đồ", "Chọc hút tế bào noãn trong thụ tinh ống nghiệm IVF"],
                    "terms": ["Spermatogonia", "Spermatid", "Graafian follicle", "Corpus luteum"]
                }
            ]
        },
        {
            "id": "mod-10-chap-2",
            "roman": "PHẦN II",
            "title": "Sinh lý Thận, Sinh dục & Thăng bằng Nội môi",
            "latin": "Physiologia Renalis, Reproductionis & Homeostasis",
            "lessons": [
                {
                    "code": "CM6.LT6",
                    "title": "LT6. Chức năng hệ tiết niệu",
                    "dept": "Bộ môn Sinh lý thường",
                    "latin": "Functio renalis & Filtratio glomerularis",
                    "min": 35, "questions": 22, "status": "in_progress",
                    "objectives": ["Cơ chế lọc cầu thận và các yếu tố quyết định lưu lượng lọc GFR", "Cơ chế tái hấp thu và bài tiết tại ống lượn gần, quai Henle, ống xa", "Cơ chế nhân nồng độ ngược dòng và tác dụng hormone ADH, Aldosterone"],
                    "clinical": ["Ước tính mức lọc cầu thận eGFR bằng công thức CKD-EPI", "Đái tháo nhạt do thiếu ADH"],
                    "terms": ["GFR", "Countercurrent multiplier", "Aldosterone", "Vasopressin"]
                },
                {
                    "code": "CM6.LT7",
                    "title": "LT7. Sinh lý sinh dục nam",
                    "dept": "Bộ môn Sinh lý thường",
                    "latin": "Physiologia genitalis masculi",
                    "min": 25, "questions": 16, "status": "not_started",
                    "objectives": ["Quá trình sinh tinh và các yếu tố ảnh hưởng", "Tác dụng sinh học của Testosterone trên cơ thể nam giới", "Điều hòa trục Dưới đồi - Tuyến yên - Tinh hoàn bởi GnRH, LH, FSH"],
                    "clinical": ["Cơ chế thuốc ức chế PDE-5 (Sildenafil) trong rối loạn cương", "Suy tuyến sinh dục nam"],
                    "terms": ["Testosterone", "Spermatogenesis", "GnRH", "Sildenafil"]
                },
                {
                    "code": "CM6.LT8",
                    "title": "LT8. Sinh lý sinh dục nữ",
                    "dept": "Bộ môn Sinh lý thường",
                    "latin": "Physiologia genitalis feminae & Cyclus",
                    "min": 30, "questions": 18, "status": "not_started",
                    "objectives": ["Chu kỳ buồng trứng: pha nang noãn, đỉnh LH phóng noãn, pha hoàng thể", "Chu kỳ nội mạc tử cung: pha tăng sinh, pha chế tiết, hành kinh", "Tác dụng phối hợp của Estrogen và Progesterone"],
                    "clinical": ["Cơ chế tránh thai nội tiết ức chế đỉnh LH", "Định lượng beta-hCG chẩn đoán thai sớm"],
                    "terms": ["Estrogen", "Progesterone", "LH surge", "Endometrium", "hCG"]
                },
                {
                    "code": "CM6.LT9",
                    "title": "LT9. Rối loạn cân bằng nước - điện giải",
                    "dept": "Bộ môn Sinh lý bệnh",
                    "latin": "Perturbationes aquae et electrolytorum",
                    "min": 30, "questions": 18, "score": 65, "status": "review_needed",
                    "objectives": ["Phân loại mất nước: ưu trương, đẳng trương, nhược trương", "Cơ chế hạ Natri máu và phù não", "Tăng Kali máu và nguy cơ rung thất ngừng tim"],
                    "clinical": ["Biến đổi sóng T nhọn đối xứng trên ECG trong tăng Kali", "Hội chứng tiêu myelin cầu não khi bù Natri quá nhanh"],
                    "terms": ["Hyponatremia", "Hyperkalemia", "Osmolality", "Myelinolysis"]
                },
                {
                    "code": "CM6.LT10",
                    "title": "LT10. Rối loạn cân bằng acid - base",
                    "dept": "Bộ môn Sinh lý bệnh",
                    "latin": "Perturbationes aequilibrii acidobasici",
                    "min": 30, "questions": 18, "status": "not_started",
                    "objectives": ["4 rối loạn thăng bằng toan kiềm cơ bản: toan/kiềm hô hấp & chuyển hóa", "Khoảng trống Anion Gap trong toan chuyển hóa", "Cơ chế bù trừ của phổi (thay đổi PaCO2) và thận (thay đổi HCO3-)"],
                    "clinical": ["Phân tích kết quả khí máu động mạch (ABG)", "Toan ceton do đái tháo đường DKA"],
                    "terms": ["Anion Gap", "Acidosis metabolica", "Alkalosis respiratoria", "ABG"]
                },
                {
                    "code": "CM6.TH5",
                    "title": "TH5. Điều hoà bài tiết thận",
                    "dept": "Bộ môn Sinh lý thường",
                    "latin": "Practica: Regulatio secretionis renalis",
                    "min": 45, "questions": 15, "status": "not_started",
                    "objectives": ["Thực nghiệm đo thể tích nước tiểu trên thỏ sau tải nước và tải muối", "Khảo sát tác dụng bài niệu của Furosemide", "Phân tích tác dụng co mạch và giảm bài niệu của Adrenaline"],
                    "clinical": ["Theo dõi lượng nước tiểu theo giờ ở bệnh nhân ICU", "Test nhịn nước chẩn đoán đái tháo nhạt"],
                    "terms": ["Diuresis", "Urine output", "Furosemide action"]
                },
                {
                    "code": "CM6.TH6",
                    "title": "TH6. Các thử nghiệm thăm dò chức năng thận",
                    "dept": "Hóa sinh",
                    "latin": "Practica: Laboratorium renale",
                    "min": 45, "questions": 15, "status": "not_started",
                    "objectives": ["Định lượng Ure và Creatinine huyết thanh", "Tính độ thanh thải Creatinine nội sinh (CrCl) nước tiểu 24h", "Tổng phân tích nước tiểu 10 thông số bằng que nhúng"],
                    "clinical": ["Tỷ số Protein/Creatinine nước tiểu (uPCR)", "Ý nghĩa trụ niệu trong cặn lắng nước tiểu"],
                    "terms": ["Serum Creatinine", "BUN", "Dipstick urinalysis", "Casts"]
                },
                {
                    "code": "CM6.TH7",
                    "title": "TH7. Cơ chế rối loạn cân bằng nước - điện giải",
                    "dept": "Bộ môn Sinh lý bệnh",
                    "latin": "Practica: Pathophysiologia hydro-electrolytica",
                    "min": 45, "questions": 15, "status": "not_started",
                    "objectives": ["Thực nghiệm gây phù phổi cấp huyết động trên động vật", "Phân tích cơ chế tăng áp lực thủy tĩnh và giảm áp lực keo", "Đánh giá hiệu quả của thuốc lợi tiểu và albumin trong hồi phục"],
                    "clinical": ["Xử trí cấp cứu phù phổi cấp trên lâm sàng", "Chỉ định truyền Albumin trong xơ gan cổ trướng"],
                    "terms": ["Pulmonary edema", "Colloid osmotic pressure", "Hydrostatic pressure"]
                },
                {
                    "code": "CM6.TH8",
                    "title": "TH8. Phân tích rối loạn cân bằng acid - base và nước - điện giải",
                    "dept": "Hóa sinh",
                    "latin": "Practica: Laboratorium acidobasicum",
                    "min": 45, "questions": 15, "status": "not_started",
                    "objectives": ["Thực hành đo pH, pCO2, pO2, HCO3- trên máy khí máu tự động", "Phân tích các ca lâm sàng toan kiềm hỗn hợp", "Tính khoảng trống Anion và khoảng trống Delta-Delta"],
                    "clinical": ["Phác đồ bù kiềm Natri Bicarbonate khi nào chỉ định", "Xử trí toan hô hấp cấp do ức chế trung tâm hô hấp"],
                    "terms": ["Blood gas analyzer", "Delta-delta ratio", "Base excess"]
                }
            ]
        },
        {
            "id": "mod-10-chap-3",
            "roman": "PHẦN III",
            "title": "Bệnh học Hệ Tiết niệu & Sinh dục",
            "latin": "Pathologia Urogenitalis",
            "lessons": [
                {
                    "code": "CM6.LT11",
                    "title": "LT11. Bệnh sinh và mô bệnh học viêm cầu thận, viêm khe ống thận và ung thư biểu mô thận",
                    "dept": "Giải phẫu bệnh",
                    "latin": "Pathologia renalis: Glomerulonephritis & Carcinoma",
                    "min": 35, "questions": 20, "status": "not_started",
                    "objectives": ["Cơ chế miễn dịch trong viêm cầu thận cấp sau nhiễm liên cầu", "Mô bệnh học viêm thận kẽ do thuốc và hoại tử ống thận cấp (ATN)", "Ung thư biểu mô tế bào thận (RCC) thể tế bào sáng"],
                    "clinical": ["Hội chứng thận hư vs Hội chứng viêm thận cấp", "Tam chứng kinh điển ung thư thận: đái máu, đau thắt lưng, sờ thấy u"],
                    "terms": ["Glomerulonephritis", "Renal cell carcinoma", "ATN", "Nephrotic syndrome"]
                },
                {
                    "code": "CM6.LT12",
                    "title": "LT12. Sinh lý bệnh tiền sản giật",
                    "dept": "Bộ môn Sinh lý bệnh",
                    "latin": "Pathophysiologia praeeclampsiae",
                    "min": 30, "questions": 16, "status": "not_started",
                    "objectives": ["Sinh bệnh học tái cấu trúc động mạch xoắn thất bại ở bánh rau", "Tổn thương nội mô toàn thể và rối loạn phóng thích yếu tố tăng sinh mạch", "Cơ chế tăng huyết áp thai kỳ, protein niệu và tổn thương đa cơ quan"],
                    "clinical": ["Hội chứng HELLP biến chứng nguy kịch", "Sử dụng Magnesi Sulfat dự phòng co giật sản giật"],
                    "terms": ["Preeclampsia", "HELLP syndrome", "Endothelial dysfunction", "Magnesium sulfate"]
                },
                {
                    "code": "CM6.LT13",
                    "title": "LT13. Giải phẫu bệnh u vú, u xơ tử cung, u nang buồng trứng, ung thư cổ tử cung",
                    "dept": "Giải phẫu bệnh",
                    "latin": "Pathologia gynaecologica & Mammaria",
                    "min": 35, "questions": 20, "status": "not_started",
                    "objectives": ["Mô bệnh học ung thư biểu mô tuyến vú xâm nhập", "U xơ tử cung (Leiomyoma) và u quái buồng trứng (Teratoma)", "Mối liên quan giữa virus HPV và các mức độ loạn sản cổ tử cung (CIN I-III)"],
                    "clinical": ["Sàng lọc ung thư cổ tử cung bằng Pap smear và xét nghiệm HPV", "Phân loại BIRADS trên nhũ ảnh vú"],
                    "terms": ["Invasive ductal carcinoma", "Leiomyoma", "CIN", "HPV oncogenesis"]
                }
            ]
        },
        {
            "id": "mod-10-chap-4",
            "roman": "PHẦN IV",
            "title": "Dược lý Hệ Tiết niệu & Sinh dục",
            "latin": "Pharmacologia Urogenitalis",
            "lessons": [
                {
                    "code": "CM6.LT14",
                    "title": "LT14. Thuốc lợi niệu",
                    "dept": "Viện đào tạo dược",
                    "latin": "Medicamenta diuretica",
                    "min": 30, "questions": 18, "status": "not_started",
                    "objectives": ["Thuốc lợi tiểu quai (Furosemide): ức chế đồng vận chuyển Na+/K+/2Cl-", "Lợi tiểu Thiazide (Hydrochlorothiazide): ức chế kênh Na+/Cl- ống lượn xa", "Lợi tiểu giữ kali kháng Aldosterone (Spironolactone)"],
                    "clinical": ["Chỉ định Furosemide trong suy tim cấp và phù phổi cấp", "Nguy cơ tăng kali máu khi phối hợp Spironolactone với ACEi"],
                    "terms": ["Furosemide", "Hydrochlorothiazide", "Spironolactone", "Na+/K+/2Cl-"]
                },
                {
                    "code": "CM6.LT15",
                    "title": "LT15. Các thuốc tác động vào hệ sinh dục - sinh sản",
                    "dept": "Viện đào tạo dược",
                    "latin": "Medicamenta systematis genitalis",
                    "min": 30, "questions": 18, "status": "not_started",
                    "objectives": ["Thuốc tránh thai nội tiết phối hợp và đơn thuần Progestin", "Thuốc kích thích co bóp tử cung (Oxytocin) và thuốc giảm co (Atosiban)", "Thuốc điều trị phì đại lành tính tuyến tiền liệt: chẹn alpha-1 và ức chế 5-alpha reductase"],
                    "clinical": ["Xử trí băng huyết sau sinh bằng Oxytocin", "Tác dụng phụ hạ huyết áp tư thế của Tamsulosin"],
                    "terms": ["Oxytocin", "Progestin", "Finasteride", "Tamsulosin"]
                }
            ]
        }
    ]
}

MODULE_11_DATA = {
    "id": "mod-11",
    "name": "Module 11 - Thần kinh",
    "latin": "Systema Nervosum (25.DY.K55.11)",
    "code": "MOD-11",
    "color": "#4A3B69",
    "chapters": [
        {
            "id": "mod-11-chap-1",
            "roman": "PHẦN I",
            "title": "Giải phẫu Hệ Thần kinh Trung ương",
            "latin": "Anatomia Systematis Nervosi Centralis",
            "lessons": [
                {
                    "code": "K55.LT1",
                    "title": "LT1. Đại cương hệ thần kinh",
                    "dept": "Bộ môn Giải phẫu",
                    "latin": "Generalitates systematis nervosi",
                    "min": 25, "questions": 16, "score": 95, "status": "completed",
                    "objectives": ["Phân chia giải phẫu và chức năng của hệ thần kinh", "Cấu tạo mô học tế bào neuron và các tế bào thần kinh đệm", "Sợi trục có myelin vs không myelin và sự dẫn truyền nhảy vọt qua eo Ranvier"],
                    "clinical": ["Bệnh xơ cứng rải rác hủy myelin", "Hàng rào máu não BBB trong dược trị liệu thần kinh"],
                    "terms": ["Neuron", "Neuroglia", "Myelin", "Ranvier node", "Blood-brain barrier"]
                },
                {
                    "code": "K55.LT2",
                    "title": "LT2. Giải phẫu tủy sống, thân não, tiểu não, gian não, bán cầu đại não",
                    "dept": "Bộ môn Giải phẫu",
                    "latin": "Medulla spinalis, Truncus, Cerebellum & Cerebrum",
                    "min": 35, "questions": 22, "score": 90, "status": "completed",
                    "objectives": ["Hình thể ngoài và cấu trúc chất xám, chất trắng của tủy sống", "Cấu tạo thân não: hành não, cầu não, trung não và trám não", "Tiểu não và các thùy não bán cầu đại não (trán, đỉnh, thái dương, chẩm)"],
                    "clinical": ["Hội chứng tổn thương nửa tủy Brown-Sequard", "Thất điều tiểu não (Cerebellar ataxia)"],
                    "terms": ["Medulla spinalis", "Truncus encephali", "Cerebellum", "Sulcus centralis"]
                },
                {
                    "code": "K55.LT5",
                    "title": "LT5. Giải phẫu màng não, màng tủy, các não thất, dịch não tủy",
                    "dept": "Bộ môn Giải phẫu",
                    "latin": "Meninges, Ventriculi & Liquor cerebrospinalis",
                    "min": 30, "questions": 20, "score": 88, "status": "completed",
                    "objectives": ["3 lớp màng não: màng cứng, màng nhện, màng nuôi", "Hệ thống não thất và vòng tuần hoàn của dịch não tủy", "Vòng nối động mạch đa giác Willis nuôi não"],
                    "clinical": ["Máu tụ ngoài màng cứng do rách động mạch màng não giữa", "Kỹ thuật chọc dò dịch não tủy khoang gian đốt L4-L5"],
                    "terms": ["Dura mater", "Arachnoidea", "Pia mater", "Circulus arteriosus Willisii", "Liquor"]
                },
                {
                    "code": "K55.TH1",
                    "title": "TH1. Giải phẫu tủy sống, dây thần kinh sống",
                    "dept": "Bộ môn Giải phẫu",
                    "latin": "Practica: Medulla spinalis & Nervi spinales",
                    "min": 45, "questions": 15, "score": 90, "status": "completed",
                    "objectives": ["Xác định nón tủy và đuôi ngựa trên mô hình", "Chỉ các rễ trước (vận động) và rễ sau (cảm giác) dây thần kinh gai", "Nhận biết hạch gai rễ sau"],
                    "clinical": ["Chọc dịch não tủy an toàn dưới mức nón tủy (dưới L2)", "Hội chứng chùm đuôi ngựa cấp"],
                    "terms": ["Conus medullaris", "Cauda equina", "Radix anterior", "Ganglion spinale"]
                },
                {
                    "code": "K55.TH2",
                    "title": "TH2. Giải phẫu thân não, tiểu não",
                    "dept": "Bộ môn Giải phẫu",
                    "latin": "Practica: Truncus encephali & Cerebellum",
                    "min": 45, "questions": 15, "score": 86, "status": "completed",
                    "objectives": ["Chỉ các rãnh hành cầu, cầu cuống và trám hành", "Xác định hố trám (sàn não thất tư)", "Chỉ các bán cầu tiểu não, thùy nhộng và cuống tiểu não"],
                    "clinical": ["Hội chứng Wallenberg tổn thương hành não sau ngoài", "Chèn ép thân não do tụt kẹt não"],
                    "terms": ["Pons", "Medulla oblongata", "Fossa rhomboidea", "Vermis"]
                },
                {
                    "code": "K55.TH3",
                    "title": "TH3. Giải phẫu gian não, bán cầu đại não",
                    "dept": "Bộ môn Giải phẫu",
                    "latin": "Practica: Diencephalon & Hemispherium",
                    "min": 45, "questions": 15, "score": 88, "status": "completed",
                    "objectives": ["Xác định đồi thị, vùng hạ đồi và thể chai", "Chỉ các rãnh trung tâm Rolando, rãnh bên Sylvius", "Nhận biết các hồi não: hồi trước trung tâm, hồi sau trung tâm"],
                    "clinical": ["Nhồi máu bao trong gây liệt nửa người đối bên", "Tổn thương đồi thị gây hội chứng đau trung ương"],
                    "terms": ["Thalamus", "Hypothalamus", "Corpus callosum", "Capsula interna"]
                },
                {
                    "code": "K55.TH5",
                    "title": "TH5. Giải phẫu màng não, màng tủy, các não thất, dịch não tủy",
                    "dept": "Bộ môn Giải phẫu",
                    "latin": "Practica: Meninges & Ventriculi",
                    "min": 45, "questions": 15, "score": 85, "status": "completed",
                    "objectives": ["Chỉ các nếp màng cứng: liềm đại não, lều tiểu não", "Xác định các xoang tĩnh mạch màng cứng: xoang dọc trên, xoang ngang", "Mô tả dòng chảy dịch não tủy từ não thất bên qua cống Sylvius"],
                    "clinical": ["Huyết khối xoang tĩnh mạch màng não", "Não úng thủy tắc nghẽn do hẹp cống não"],
                    "terms": ["Falx cerebri", "Tentorium cerebelli", "Sinus sagittalis superior", "Aqueductus Sylvii"]
                }
            ]
        },
        {
            "id": "mod-11-chap-2",
            "roman": "PHẦN II",
            "title": "Dây Thần kinh Sọ & Các Đám rối Thần kinh",
            "latin": "Nervi Craniales & Plexus Nervosi",
            "lessons": [
                {
                    "code": "K55.LT6",
                    "title": "LT6. Các dây thần kinh sọ não",
                    "dept": "Bộ môn Giải phẫu",
                    "latin": "Nervi craniales I - XII",
                    "min": 35, "questions": 24, "score": 88, "status": "completed",
                    "objectives": ["Nguyên ủy hư, lỗ nền sọ và chức năng của 12 đôi dây thần kinh sọ", "Đường đi và vùng chi phối của dây VII (thần kinh mặt)", "Giải phẫu dây V (thần kinh sinh ba) và dây X (thần kinh lang thang)"],
                    "clinical": ["Liệt mặt Bell's palsy vs Liệt mặt trung ương", "Đau dây thần kinh số V kịch phát"],
                    "terms": ["Nervus facialis", "Nervus trigeminus", "Nervus vagus", "Nervus oculomotorius"]
                },
                {
                    "code": "K55.LT7",
                    "title": "LT7. Các đám rối thần kinh",
                    "dept": "Bộ môn Giải phẫu",
                    "latin": "Plexus brachialis & Plexus lumbosacralis",
                    "min": 40, "questions": 25, "score": 92, "status": "completed",
                    "objectives": ["Cấu tạo đám rối cánh tay từ rễ C5-T1, các thân, ngành và bó", "5 nhánh tận chính: quay, giữa, trụ, nách, cơ bì", "Đám rối thắt lưng - cùng: thần kinh đùi, bịt, ngồi (tọa)"],
                    "clinical": ["Liệt Erb-Duchenne vs Liệt Klumpke", "Tổn thương thần kinh quay gãy xương cánh tay gây bàn tay rủ cổ cò"],
                    "terms": ["Plexus brachialis", "Nervus radialis", "Nervus medianus", "Nervus ischiadicus"]
                },
                {
                    "code": "K55.TH6",
                    "title": "TH6. Giải phẫu các dây thần kinh sọ",
                    "dept": "Bộ môn Giải phẫu",
                    "latin": "Practica: Nervi craniales",
                    "min": 45, "questions": 15, "score": 90, "status": "completed",
                    "objectives": ["Chỉ nguyên ủy hư của 12 đôi dây sọ ở đáy não", "Nhận diện các nhánh V1, V2, V3 chui qua các lỗ nền sọ", "Khám lâm sàng vận nhãn (dây III, IV, VI) và cảm giác mặt"],
                    "clinical": ["Hội chứng đỉnh hốc mắt", "Khám liệt dây thần kinh sọ trên bệnh nhân hôn mê"],
                    "terms": ["Foramen ovale", "Fissura orbitalis superior", "Foramen jugulare"]
                },
                {
                    "code": "K55.TH7",
                    "title": "TH7. Giải phẫu các đám rối thần kinh",
                    "dept": "Bộ môn Giải phẫu",
                    "latin": "Practica: Plexus nervosi",
                    "min": 45, "questions": 15, "score": 92, "status": "completed",
                    "objectives": ["Bộc lộ đám rối thần kinh cánh tay trong hố nách trên xác", "Chỉ sự tạo thành quai thần kinh giữa kẹp trước động mạch nách", "Xác định đường đi thần kinh ngồi qua khuyết ngồi lớn"],
                    "clinical": ["Vị trí gây tê đám rối cánh tay đường trên đòn và đường nách", "Vị trí tiêm mông an toàn tránh thần kinh tọa"],
                    "terms": ["Axillary sheath", "Ansa mediani", "Foramen ischiadicum majus"]
                }
            ]
        },
        {
            "id": "mod-11-chap-3",
            "roman": "PHẦN III",
            "title": "Sinh lý Thần kinh, Giác quan & Hoạt động Cấp cao",
            "latin": "Physiologia Nervosa, Sensus & Functio Superior",
            "lessons": [
                {
                    "code": "K55.LT3",
                    "title": "LT3. Chức năng vận động, cảm giác của hệ thần kinh",
                    "dept": "Bộ môn Sinh lý thường",
                    "latin": "Functio motorica et sensorica",
                    "min": 35, "questions": 20, "score": 86, "status": "completed",
                    "objectives": ["Vỏ não vận động sơ cấp và dải vỏ gai (bó tháp) dẫn truyền vận động có ý thức", "Đường dẫn truyền cảm giác nông (đau, nhiệt) qua bó gai - thị đồi", "Đường dẫn truyền cảm giác sâu qua bó Goll và Burdach"],
                    "clinical": ["Dấu hiệu Babinski trong tổn thương nơron vận động trên", "Nghiệm pháp Romberg thất điều cảm giác"],
                    "terms": ["Tractus corticospinalis", "Pyramidal tract", "Babinski sign", "Romberg test"]
                },
                {
                    "code": "K55.LT4",
                    "title": "LT4. Cảm giác chuyên biệt",
                    "dept": "Bộ môn Sinh lý thường",
                    "latin": "Sensus speciales: Visus, Auditus, Vestibulum",
                    "min": 30, "questions": 18, "score": 82, "status": "completed",
                    "objectives": ["Sinh lý thị giác: tế bào que, tế bào nón và đường dẫn truyền thị giác đến vỏ não chẩm", "Sinh lý thính giác: cơ quan Corti và dải thính giác", "Cơ quan tiền đình và phản xạ điều chỉnh thăng bằng"],
                    "clinical": ["Bán manh hai thái dương do u tuyến yên chèn giao thoa thị giác", "Chóng mặt tiền đình kịch phát"],
                    "terms": ["Chiasma opticum", "Organon Corti", "Retina", "Hemianopsia"]
                },
                {
                    "code": "K55.LT8,9",
                    "title": "LT 8, 9. Hệ thần kinh thực vật; Chức năng của các cấu trúc dưới vỏ và vỏ bán cầu đại não",
                    "dept": "Bộ môn Sinh lý thường",
                    "latin": "Systema nervosum autonomicum & Cortex cerebri",
                    "min": 35, "questions": 20, "status": "in_progress",
                    "objectives": ["Hệ giao cảm (chuỗi hạch cạnh sống) vs Đối giao cảm (hạch cạnh tạng)", "Chức năng của các hạch nền (thể vân, liềm đen) trong kiểm soát trương lực cơ", "Các diện chức năng vỏ não Brodmann"],
                    "clinical": ["Hội chứng Parkinson do thoái hóa nơron tiết Dopamine ở liềm đen", "Hội chứng Horner mất phân bố giao cảm mắt"],
                    "terms": ["Sympathetic", "Parasympathetic", "Basal ganglia", "Substantia nigra", "Horner"]
                },
                {
                    "code": "K55.LT10",
                    "title": "LT10. Hoạt động thần kinh cấp cao, phản xạ có điều kiện, giấc ngủ",
                    "dept": "Bộ môn Sinh lý thường",
                    "latin": "Functio nervosa superior & Somnus",
                    "min": 25, "questions": 16, "status": "in_progress",
                    "objectives": ["Học thuyết phản xạ có điều kiện của Pavlov", "Các vùng ngôn ngữ Broca và Wernicke", "Các giai đoạn của giấc ngủ NREM và REM, sóng điện não EEG"],
                    "clinical": ["Phân biệt mất ngôn ngữ Broca vs Wernicke", "Rối loạn giấc ngủ và động kinh trên EEG"],
                    "terms": ["Broca aphasia", "Wernicke aphasia", "REM sleep", "Pavlovian reflex"]
                },
                {
                    "code": "K55.TH4",
                    "title": "TH4. Giải phẫu tai, mắt",
                    "dept": "Bộ môn Giải phẫu",
                    "latin": "Practica: Oculus & Auris",
                    "min": 45, "questions": 15, "score": 88, "status": "completed",
                    "objectives": ["Mô tả cấu tạo các màng nhãn cầu: màng xơ, màng mạch, võng mạc", "Xác định các cơ vận nhãn ngoài và dây thần kinh chi phối", "Cấu tạo tai ngoài, tai giữa (hòm nhĩ, chuỗi xương con) và tai trong"],
                    "clinical": ["Đục thủy tinh thể và bệnh Glaucoma tăng nhãn áp", "Viêm tai giữa cấp tính ở trẻ nhỏ"],
                    "terms": ["Cornea", "Retina", "Membrana tympanica", "Ossicula auditus"]
                },
                {
                    "code": "K55.TH8",
                    "title": "TH8. Hoạt động dẫn truyền, cung phản xạ và vai trò một số cấu trúc dưới vỏ với vận động",
                    "dept": "Bộ môn Sinh lý thường",
                    "latin": "Practica: Arcus reflexus & Motus",
                    "min": 45, "questions": 15, "status": "in_progress",
                    "objectives": ["Thực nghiệm đo thời gian phản xạ tủy trên ếch", "Thực hành khám các phản xạ gân xương trên người: gân bánh chè, gân gót, gân nhị đầu", "Quan sát hiện tượng cứng mất não khi cắt ngang thân não động vật"],
                    "clinical": ["Tăng phản xạ gân xương trong tổn thương bó tháp", "Đánh giá mức độ hôn mê theo thang điểm Glasgow"],
                    "terms": ["Patellar reflex", "Decerebrate rigidity", "Glasgow coma scale"]
                },
                {
                    "code": "K55.TH9",
                    "title": "TH9. Phản xạ có điều kiện và một số cảm giác chuyên biệt",
                    "dept": "Bộ môn Sinh lý thường",
                    "latin": "Practica: Reflexus conditionatus & Sensus",
                    "min": 45, "questions": 15, "status": "in_progress",
                    "objectives": ["Thực nghiệm thành lập phản xạ có điều kiện tiết nước bọt hoặc phòng vệ", "Đo thị lực bằng bảng Snellen và kiểm tra sắc giác Ishihara", "Đo thính lực bằng âm thoa (nghiệm pháp Weber và Rinne)"],
                    "clinical": ["Phân biệt điếc dẫn truyền vs điếc tiếp nhận bằng nghiệm pháp Rinne", "Mù màu bẩm sinh"],
                    "terms": ["Weber test", "Rinne test", "Ishihara chart", "Snellen chart"]
                }
            ]
        },
        {
            "id": "mod-11-chap-4",
            "roman": "PHẦN IV",
            "title": "Bệnh học & Dược lý Hệ Thần kinh",
            "latin": "Pathologia & Pharmacologia Neurologica",
            "lessons": [
                {
                    "code": "K55.LT11",
                    "title": "LT11. Sinh lý bệnh, Giải phẫu bệnh phù não",
                    "dept": "Bộ môn Sinh lý bệnh",
                    "latin": "Edema cerebri & Ictus apoplecticus",
                    "min": 35, "questions": 20, "score": 72, "status": "review_needed",
                    "objectives": ["Phân loại phù não do mạch (vasogenic) vs độc tế bào (cytotoxic)", "Hội chứng tăng áp lực nội sọ và tam chứng Cushing", "Sinh lý bệnh đột quỵ nhồi máu não và xuất huyết não"],
                    "clinical": ["Chỉ định Alteplase r-tPA trong cửa sổ 4.5h đột quỵ", "Liệu pháp tăng thẩm thấu bằng Mannitol"],
                    "terms": ["Edema cerebri", "Intracranial pressure", "Cushing triad", "r-tPA", "Mannitol"]
                },
                {
                    "code": "K55.LT12",
                    "title": "LT12. Các thuốc tác động hướng thần",
                    "dept": "Viện đào tạo dược",
                    "latin": "Medicamenta psychotropica",
                    "min": 30, "questions": 18, "status": "not_started",
                    "objectives": ["Thuốc an thần gây ngủ Benzodiazepine: gắn thụ thể GABA-A", "Thuốc chống trầm cảm tái hấp thu chọn lọc Serotonin (SSRI)", "Thuốc chống loạn thần điển hình và không điển hình (kháng Dopamine D2)"],
                    "clinical": ["Giải độc Benzodiazepine bằng Flumazenil", "Hội chứng ngoại tháp do thuốc chống loạn thần"],
                    "terms": ["Diazepam", "Fluoxetine", "Haloperidol", "Flumazenil", "GABA-A"]
                },
                {
                    "code": "K55.LT13",
                    "title": "LT13. Các thuốc tác động lên hoạt động của các chất dẫn truyền thần kinh và kênh ion trong não",
                    "dept": "Viện đào tạo dược",
                    "latin": "Medicamenta neurotransmissionis & Canales ionici",
                    "min": 30, "questions": 18, "status": "not_started",
                    "objectives": ["Thuốc chống động kinh chẹn kênh Natri điện thế (Carbamazepine, Phenytoin)", "Thuốc tăng cường dẫn truyền GABA (Valproate, Gabapentin)", "Thuốc điều trị bệnh Parkinson tăng tiền chất Dopamine (Levodopa/Carbidopa)"],
                    "clinical": ["Theo dõi nồng độ thuốc động kinh trong máu", "Hội chứng bật tắt (on-off) khi dùng Levodopa kéo dài"],
                    "terms": ["Carbamazepine", "Levodopa", "Sodium valproate", "Ion channels"]
                },
                {
                    "code": "K55.LT14",
                    "title": "LT14. Thuốc tăng cường dinh dưỡng và bảo vệ tế bào thần kinh",
                    "dept": "Viện đào tạo dược",
                    "latin": "Medicamenta neuroprotectiva",
                    "min": 25, "questions": 16, "status": "not_started",
                    "objectives": ["Thuốc tăng cường chuyển hóa não nhóm Nootropic (Piracetam, Citicoline)", "Các chất chống oxy hóa và bẫy gốc tự do bảo vệ tế bào thần kinh", "Các thuốc điều trị suy giảm nhận thức trong bệnh Alzheimer (kháng Cholinesterase Donepezil)"],
                    "clinical": ["Chỉ định Donepezil trong sa sút trí tuệ Alzheimer", "Hồi phục chức năng thần kinh sau chấn thương sọ não"],
                    "terms": ["Citicoline", "Donepezil", "Piracetam", "Neuroprotection"]
                }
            ]
        }
    ]
}

ALL_MODULES = [MODULE_8_DATA, MODULE_9_DATA, MODULE_10_DATA, MODULE_11_DATA]

# Print stats
total_lessons = sum(sum(len(c["lessons"]) for c in m["chapters"]) for m in ALL_MODULES)
print(f"Total structured modules: {len(ALL_MODULES)}")
print(f"Total structured lessons across all 4 modules: {total_lessons}")
for m in ALL_MODULES:
    count = sum(len(c["lessons"]) for c in m["chapters"])
    print(f"  {m['name']}: {count} lessons across {len(m['chapters'])} chapters")

