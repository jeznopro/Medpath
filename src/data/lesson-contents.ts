// MEDPATH — Default Educational Lesson Contents
// Provides official, high-yield textbook lecture content with anatomical atlas figures

export const DEFAULT_LESSON_CONTENTS: Record<string, string> = {
  "les-8-1-1": `
<div class="space-y-8 text-[#30312F] font-serif leading-relaxed">

  <!-- Objectives Banner -->
  <div class="not-prose font-sans p-5 rounded-2xl bg-[#F8F5EE] border border-[#DDD7CC] shadow-sm">
    <div class="flex items-center gap-2 text-[#782F3B] font-bold text-xs uppercase tracking-wider mb-3">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <span>Mục tiêu học tập trọng tâm</span>
    </div>
    <ul class="space-y-2 text-xs sm:text-sm text-[#565551]">
      <li class="flex items-start gap-2">
        <span class="font-bold text-[#782F3B] shrink-0">1.</span>
        <span>Trình bày và giải thích được <strong>vị trí, hình thể ngoài, liên quan, hình thể trong</strong>; mạch máu và thần kinh chi phối tim.</span>
      </li>
      <li class="flex items-start gap-2">
        <span class="font-bold text-[#782F3B] shrink-0">2.</span>
        <span>Trình bày được <strong>cấu tạo các lớp thành tim</strong> và thành phần hóa học của tim.</span>
      </li>
      <li class="flex items-start gap-2">
        <span class="font-bold text-[#782F3B] shrink-0">3.</span>
        <span>Vận dụng kiến thức bài học để tư vấn, giải thích một số <strong>bệnh lý tim mạch lâm sàng</strong> (vết thương tim, tràn dịch màng ngoài tim, nhồi máu cơ tim, ổ nghe van tim).</span>
      </li>
    </ul>
  </div>

  <!-- Introductory Definition -->
  <div class="p-4 rounded-xl bg-white border-l-4 border-[#782F3B] shadow-sm">
    <p class="text-base sm:text-lg italic text-[#444340] m-0">
      <strong>Tim (cor)</strong> là một tạng cơ rỗng có nhiệm vụ co bóp đẩy máu vào động mạch và hút máu về qua các tĩnh mạch. Vì vậy, tim được coi như một cái bơm vừa đẩy, vừa hút, là bộ phận chủ yếu của hệ tuần hoàn.
    </p>
  </div>

  <!-- SECTION 1.1 -->
  <h2 class="font-serif text-2xl font-bold text-[#782F3B] border-b border-[#DDD7CC] pb-2 mt-8">
    1.1. Vị trí, hình thể ngoài, liên quan và hình thể trong của tim
  </h2>

  <!-- 1.1.1 Vị trí -->
  <h3 class="font-serif text-xl font-bold text-[#30312F] mt-6">
    1.1.1. Vị trí của tim
  </h3>
  <p>
    Tim nằm trong <strong>trung thất trước</strong> (phần trung thất giữa theo phân chia hiện đại), đè lên cơ hoành, lệch sang nửa trái của lồng ngực. Trục tim hướng <em>xuống dưới, ra trước và sang trái</em>. Nền tim hướng <em>lên trên, sang phải và ra sau</em>.
  </p>

  <!-- FIGURE 1.1 -->
  <figure class="not-prose my-6 bg-white p-4 sm:p-6 rounded-2xl border border-[#DDD7CC] shadow-md">
    <div class="overflow-hidden rounded-xl bg-[#F8F5EE] flex justify-center items-center">
      <img
        src="/images/lessons/les-8-1-1/image1.jpg"
        alt="Hình 1.1. Vị trí tim trong lồng ngực"
        class="max-h-[520px] w-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
        loading="lazy"
      />
    </div>
    <figcaption class="mt-4 text-center">
      <div class="font-serif font-bold text-sm sm:text-base text-[#30312F]">
        Hình 1.1. Vị trí tim trong lồng ngực
      </div>
      <p class="font-sans text-xs text-[#77756F] mt-1 max-w-2xl mx-auto">
        Thiết đồ đứng ngang thể hiện vị trí tim nằm đè lên cơ hoành, nằm giữa hai phổi và liên quan với các màng phổi, thần kinh hoành.
      </p>
    </figcaption>
    <!-- Callout Guide -->
    <div class="mt-4 pt-4 border-t border-[#E8E1D3] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 font-sans text-xs text-[#565551]">
      <div class="flex items-center gap-2 p-1.5 rounded bg-[#FAF7F0]"><span class="w-5 h-5 rounded-full bg-[#782F3B] text-white flex items-center justify-center font-bold text-[10px]">1</span> <span>Tĩnh mạch chủ trên</span></div>
      <div class="flex items-center gap-2 p-1.5 rounded bg-[#FAF7F0]"><span class="w-5 h-5 rounded-full bg-[#782F3B] text-white flex items-center justify-center font-bold text-[10px]">2</span> <span>Thần kinh hoành phải</span></div>
      <div class="flex items-center gap-2 p-1.5 rounded bg-[#FAF7F0]"><span class="w-5 h-5 rounded-full bg-[#782F3B] text-white flex items-center justify-center font-bold text-[10px]">3</span> <span>Cơ hoành</span></div>
      <div class="flex items-center gap-2 p-1.5 rounded bg-[#FAF7F0]"><span class="w-5 h-5 rounded-full bg-[#782F3B] text-white flex items-center justify-center font-bold text-[10px]">4</span> <span>Mạch máu màng ngoài tim phải</span></div>
      <div class="flex items-center gap-2 p-1.5 rounded bg-[#FAF7F0]"><span class="w-5 h-5 rounded-full bg-[#782F3B] text-white flex items-center justify-center font-bold text-[10px]">5</span> <span>Màng ngoài tim</span></div>
      <div class="flex items-center gap-2 p-1.5 rounded bg-[#FAF7F0]"><span class="w-5 h-5 rounded-full bg-[#782F3B] text-white flex items-center justify-center font-bold text-[10px]">6</span> <span>Mạch máu màng ngoài tim trái</span></div>
      <div class="flex items-center gap-2 p-1.5 rounded bg-[#FAF7F0] col-span-full sm:col-span-1"><span class="w-5 h-5 rounded-full bg-[#782F3B] text-white flex items-center justify-center font-bold text-[10px]">7</span> <span>Thần kinh hoành trái</span></div>
    </div>
  </figure>

  <!-- 1.1.2 Hình thể ngoài và liên quan -->
  <h3 class="font-serif text-xl font-bold text-[#30312F] mt-8">
    1.1.2. Hình thể ngoài và liên quan
  </h3>
  <p>
    Tim có hình tháp gồm <strong>3 mặt</strong> (mặt trước, mặt dưới, mặt trái), <strong>1 nền</strong> và <strong>1 đỉnh (mỏm tim)</strong>.
  </p>

  <!-- a) Mặt trước -->
  <div class="space-y-3 mt-4">
    <h4 class="font-serif text-lg font-bold text-[#782F3B]">
      a) Mặt trước hay mặt ức sườn (facies sternocostalis)
    </h4>
    <p>
      Mặt trước của tim có <strong>rãnh vành (sulcus coronarius)</strong> giới hạn hai tâm nhĩ (atria) ở phía sau trên với hai tâm thất (ventriculi) ở phía trước dưới. Mặt này thường được tiếp cận trong phẫu thuật mở ngực vào tim.
    </p>
    <p>
      <strong>Rãnh liên thất trước (sulcus interventricularis cordis anterior)</strong> chia mặt này thành hai nửa thất. Trong đó, <em>tâm thất phải chiếm tới 3/4 diện tích mặt trước</em>, còn tâm thất trái chỉ chiếm 1/4. Do đó, trên lâm sàng, các vết thương thấu ngực gây thủng tim thường xuyên nhất là đâm trúng vào tâm thất phải. Mặt trước tim liên quan mật thiết với xương ức và các sụn sườn từ III đến VI.
    </p>

    <!-- FIGURE 1.2 -->
    <figure class="not-prose my-6 bg-white p-4 sm:p-6 rounded-2xl border border-[#DDD7CC] shadow-md">
      <div class="overflow-hidden rounded-xl bg-[#F8F5EE] flex justify-center items-center">
        <img
          src="/images/lessons/les-8-1-1/image2.png"
          alt="Hình 1.2. Mặt trước tim (mặt ức sườn)"
          class="max-h-[520px] w-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
          loading="lazy"
        />
      </div>
      <figcaption class="mt-4 text-center">
        <div class="font-serif font-bold text-sm sm:text-base text-[#30312F]">
          Hình 1.2. Mặt trước tim (Mặt ức sườn)
        </div>
      </figcaption>
      <!-- Anatomy Legend Table -->
      <div class="mt-4 pt-3 border-t border-[#E8E1D3] overflow-x-auto">
        <table class="w-full font-sans text-xs text-left">
          <thead>
            <tr class="bg-[#FAF7F0] text-[#782F3B] font-bold">
              <th class="p-2 w-12 text-center">Số</th>
              <th class="p-2">Chi tiết giải phẫu (Tiếng Việt)</th>
              <th class="p-2">Thuật ngữ danh pháp Latinh</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E8E1D3]">
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">1</td><td class="p-2 font-medium">Rãnh vành phải</td><td class="p-2 italic text-[#565551]">Sulcus coronarius dexter</td></tr>
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">2</td><td class="p-2 font-medium">Động mạch vành phải</td><td class="p-2 italic text-[#565551]">Arteria coronaria dextra</td></tr>
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">3</td><td class="p-2 font-medium">Tĩnh mạch tim nhỏ</td><td class="p-2 italic text-[#565551]">Vena cordis parva</td></tr>
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">4</td><td class="p-2 font-medium">Động mạch liên thất trước</td><td class="p-2 italic text-[#565551]">Ramus interventricularis anterior</td></tr>
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">5</td><td class="p-2 font-medium">Rãnh liên thất trước</td><td class="p-2 italic text-[#565551]">Sulcus interventricularis anterior</td></tr>
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">6</td><td class="p-2 font-medium">Tĩnh mạch tim lớn</td><td class="p-2 italic text-[#565551]">Vena cordis magna</td></tr>
          </tbody>
        </table>
      </div>
    </figure>
  </div>

  <!-- b) Mặt dưới -->
  <div class="space-y-3 mt-8">
    <h4 class="font-serif text-lg font-bold text-[#782F3B]">
      b) Mặt dưới hay mặt hoành (facies diaphragmatica)
    </h4>
    <p>
      Mặt này có rãnh vành và <strong>rãnh liên thất sau (sulcus interventricularis cordis posterior)</strong>. Rãnh liên thất sau nối với rãnh liên thất trước ở bên phải mỏm tim tạo thành khuyết mỏm tim.
    </p>
    <p>
      Mặt dưới đè lên vòm hoành và qua cơ hoành liên quan trực tiếp với <em>thùy trái của gan</em> và <em>phình vị lớn dạ dày</em>. Vì liên quan này, những cơn đau thắt ngực do nhồi máu cơ tim thành hoành (thành dưới) đôi khi biểu hiện nhầm lẫn thành cơn đau thượng vị hoặc khó tiêu hóa.
    </p>

    <!-- FIGURE 1.3 -->
    <figure class="not-prose my-6 bg-white p-4 sm:p-6 rounded-2xl border border-[#DDD7CC] shadow-md">
      <div class="overflow-hidden rounded-xl bg-[#F8F5EE] flex justify-center items-center">
        <img
          src="/images/lessons/les-8-1-1/image3.png"
          alt="Hình 1.3. Mặt dưới tim (mặt hoành)"
          class="max-h-[520px] w-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
          loading="lazy"
        />
      </div>
      <figcaption class="mt-4 text-center">
        <div class="font-serif font-bold text-sm sm:text-base text-[#30312F]">
          Hình 1.3. Mặt dưới tim (Mặt hoành)
        </div>
      </figcaption>
      <!-- Anatomy Legend Table -->
      <div class="mt-4 pt-3 border-t border-[#E8E1D3] overflow-x-auto">
        <table class="w-full font-sans text-xs text-left">
          <thead>
            <tr class="bg-[#FAF7F0] text-[#782F3B] font-bold">
              <th class="p-2 w-12 text-center">Số</th>
              <th class="p-2">Chi tiết giải phẫu (Tiếng Việt)</th>
              <th class="p-2">Thuật ngữ danh pháp Latinh</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E8E1D3]">
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">1</td><td class="p-2 font-medium">Tĩnh mạch tim lớn</td><td class="p-2 italic text-[#565551]">Vena cordis magna</td></tr>
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">2</td><td class="p-2 font-medium">Nhánh mũ động mạch vành trái</td><td class="p-2 italic text-[#565551]">Ramus circumflexus (LCx)</td></tr>
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">3</td><td class="p-2 font-medium">Rãnh vành</td><td class="p-2 italic text-[#565551]">Sulcus coronarius</td></tr>
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">4</td><td class="p-2 font-medium">Xoang tĩnh mạch vành</td><td class="p-2 italic text-[#565551]">Sinus coronarius</td></tr>
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">5</td><td class="p-2 font-medium">Tĩnh mạch tim giữa</td><td class="p-2 italic text-[#565551]">Vena cordis media</td></tr>
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">6</td><td class="p-2 font-medium">Nhánh liên thất sau (ĐM vành phải)</td><td class="p-2 italic text-[#565551]">Ramus interventricularis posterior (PDA)</td></tr>
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">7</td><td class="p-2 font-medium">Rãnh liên thất sau</td><td class="p-2 italic text-[#565551]">Sulcus interventricularis posterior</td></tr>
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">8</td><td class="p-2 font-medium">Động mạch vành phải</td><td class="p-2 italic text-[#565551]">Arteria coronaria dextra</td></tr>
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">9</td><td class="p-2 font-medium">Tĩnh mạch tim nhỏ</td><td class="p-2 italic text-[#565551]">Vena cordis parva</td></tr>
          </tbody>
        </table>
      </div>
    </figure>
  </div>

  <!-- c) Mặt trái, d) Nền tim, e) Mỏm tim -->
  <div class="space-y-4 mt-6">
    <h4 class="font-serif text-lg font-bold text-[#782F3B]">
      c) Mặt trái hay mặt phổi (facies pulmonalis)
    </h4>
    <p>
      Mặt này hẹp, chủ yếu do <strong>tâm thất trái</strong> tạo nên. Mặt trái ấn vào mặt trong (mặt trung thất) của phổi trái tạo thành <em>hố tim (impressio cardiaca)</em> của phổi trái, có bó mạch và thần kinh hoành trái đi qua.
    </p>

    <h4 class="font-serif text-lg font-bold text-[#782F3B]">
      d) Nền tim (basis cordis)
    </h4>
    <p>
      Nền tim nhìn ra sau và hơi sang phải, tương ứng với mặt sau của hai tâm nhĩ:
    </p>
    <ul class="list-disc pl-6 space-y-2">
      <li>
        <strong>Tâm nhĩ trái:</strong> Nhận 4 tĩnh mạch phổi (2 tĩnh mạch phổi phải, 2 tĩnh mạch phổi trái) đổ vào. Tâm nhĩ trái liên quan đặc biệt quan trọng ở phía sau với <em>thực quản</em> (khi tâm nhĩ trái phì đại do hẹp van hai lá có thể đè vào thực quản gây nuốt nghẹn hoặc siêu âm tim qua ngả thực quản cho hình ảnh van hai lá rõ nhất).
      </li>
      <li>
        <strong>Tâm nhĩ phải:</strong> Nhận <em>tĩnh mạch chủ trên</em> (v. cava superior), <em>tĩnh mạch chủ dưới</em> (v. cava inferior) và <em>xoang tĩnh mạch vành</em> đổ vào. Liên quan với màng phổi phải và bó mạch thần kinh hoành phải.
      </li>
      <li>
        Ở phía trên nền tim là các thân mạch máu lớn xuất phát từ tim: <strong>quai động mạch chủ (arcus aortae)</strong> và <strong>thân động mạch phổi (truncus pulmonalis)</strong>.
      </li>
    </ul>

    <h4 class="font-serif text-lg font-bold text-[#782F3B]">
      e) Mỏm tim hay đỉnh tim (apex cordis)
    </h4>
    <p>
      Mỏm tim hướng ra trước, xuống dưới và sang trái. Bình thường ở người trưởng thành, mỏm tim nằm tương ứng tại <strong>khoảng gian sườn V trên đường giữa đòn trái</strong> (đường giữa đòn là đường thẳng đứng hạ từ trung điểm xương đòn đi qua núm vú nam giới).
    </p>
  </div>

  <!-- f) Đối chiếu và huyệt nghe tim -->
  <div class="space-y-4 mt-8">
    <h4 class="font-serif text-lg font-bold text-[#782F3B]">
      f) Đối chiếu tim lên thành ngực và các huyệt (ổ) nghe tim
    </h4>
    <p>
      <strong>Đối chiếu tim lên thành ngực:</strong> Là một diện hình tứ giác xác định bởi 4 góc:
    </p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose font-sans text-xs">
      <div class="p-3 bg-white rounded-xl border border-[#DDD7CC] shadow-sm">
        <span class="font-bold text-[#782F3B]">Góc trên phải:</span> Khoảng liên sườn II, cách bờ phải xương ức 1 cm.
      </div>
      <div class="p-3 bg-white rounded-xl border border-[#DDD7CC] shadow-sm">
        <span class="font-bold text-[#782F3B]">Góc trên trái:</span> Khoảng liên sườn II, cách bờ trái xương ức 1 cm.
      </div>
      <div class="p-3 bg-white rounded-xl border border-[#DDD7CC] shadow-sm">
        <span class="font-bold text-[#782F3B]">Góc dưới phải:</span> Khoảng liên sườn V, sát bờ phải xương ức.
      </div>
      <div class="p-3 bg-white rounded-xl border border-[#DDD7CC] shadow-sm">
        <span class="font-bold text-[#782F3B]">Góc dưới trái:</span> Khoảng liên sườn V, trên đường giữa đòn trái (mỏm tim).
      </div>
    </div>

    <p class="mt-4">
      <strong>Huyệt nghe tim trên lâm sàng (nghe tiếng đóng mở của các van tim):</strong>
    </p>
    <div class="not-prose overflow-x-auto">
      <table class="w-full font-sans text-xs text-left bg-white rounded-xl border border-[#DDD7CC] overflow-hidden shadow-sm">
        <thead class="bg-[#FAF7F0] text-[#782F3B] font-bold border-b border-[#DDD7CC]">
          <tr>
            <th class="p-3">Van tim</th>
            <th class="p-3">Vị trí ổ nghe trên thành ngực</th>
            <th class="p-3">Ý nghĩa lâm sàng</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#E8E1D3]">
          <tr>
            <td class="p-3 font-bold text-[#30312F]">Van động mạch chủ</td>
            <td class="p-3">Khoảng liên sườn II, cách bờ phải xương ức 2 cm</td>
            <td class="p-3 text-[#565551]">Nghe tiếng T2, phát hiện tiếng thổi hẹp/hở van ĐMC lan lên cổ</td>
          </tr>
          <tr>
            <td class="p-3 font-bold text-[#30312F]">Van động mạch phổi</td>
            <td class="p-3">Khoảng liên sườn II, cách bờ trái xương ức 2 cm</td>
            <td class="p-3 text-[#565551]">Nghe thành phần P2 của tiếng T2, tiếng thổi tâm thu hẹp van ĐMP</td>
          </tr>
          <tr>
            <td class="p-3 font-bold text-[#30312F]">Van ba lá</td>
            <td class="p-3">Khoảng liên sườn V sát bờ phải xương ức (hoặc mũi ức)</td>
            <td class="p-3 text-[#565551]">Tiếng thổi tâm thu trong hở van 3 lá (dấu hiệu Carvallo dương tính)</td>
          </tr>
          <tr>
            <td class="p-3 font-bold text-[#30312F]">Van hai lá</td>
            <td class="p-3">Khoảng liên sườn V trên đường giữa đòn trái (mỏm tim)</td>
            <td class="p-3 text-[#565551]">Nghe tiếng T1 đanh, rung tâm trương (hẹp van 2 lá), tiếng thổi tâm thu lan nách (hở van 2 lá)</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- 1.1.3 Hình thể trong -->
  <h3 class="font-serif text-xl font-bold text-[#30312F] mt-10">
    1.1.3. Hình thể trong của tim
  </h3>
  <p>
    Tim được ngăn thành <strong>hai nửa phải và trái</strong> biệt lập nhờ vách ngăn dọc. Mỗi nửa tim gồm một <em>buồng nhĩ (atrium cordis)</em> ở phía trên và một <em>buồng thất (ventriculus cordis)</em> ở phía dưới. Nhĩ và thất thông nhau qua các lỗ nhĩ thất có van đậy kín một chiều:
  </p>
  <ul class="list-disc pl-6 space-y-1">
    <li><strong>Lỗ nhĩ thất phải (ostium atrioventriculare dextrum):</strong> Được đậy bởi <em>van ba lá (valva tricuspidalis)</em>.</li>
    <li><strong>Lỗ nhĩ thất trái (ostium atrioventriculare sinistrum):</strong> Được đậy bởi <em>van hai lá (valva bicuspidalis / mitralis)</em>.</li>
  </ul>

  <!-- FIGURE 1.4 -->
  <figure class="not-prose my-6 bg-white p-4 sm:p-6 rounded-2xl border border-[#DDD7CC] shadow-md">
    <div class="overflow-hidden rounded-xl bg-[#F8F5EE] flex justify-center items-center">
      <img
        src="/images/lessons/les-8-1-1/image4.png"
        alt="Hình 1.4. Hình thể trong tim và các vách ngăn"
        class="max-h-[540px] w-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
        loading="lazy"
      />
    </div>
    <figcaption class="mt-4 text-center">
      <div class="font-serif font-bold text-sm sm:text-base text-[#30312F]">
        Hình 1.4. Hình thể trong tim và các vách ngăn
      </div>
      <div class="font-sans text-xs text-[#565551] flex justify-center gap-6 mt-2">
        <span><strong>1.</strong> Vách liên nhĩ</span>
        <span><strong>2.</strong> Vách nhĩ thất</span>
        <span><strong>3.</strong> Vách liên thất</span>
      </div>
    </figcaption>
  </figure>

  <!-- a) Vách ngăn dọc -->
  <div class="space-y-3 mt-4">
    <h4 class="font-serif text-lg font-bold text-[#782F3B]">
      a) Hệ thống vách ngăn dọc
    </h4>
    <p>
      Gồm ba vách liên tục với nhau:
    </p>
    <ul class="list-disc pl-6 space-y-2">
      <li>
        <strong>Vách liên nhĩ (septum interatriale):</strong> Ngăn cách giữa hai tâm nhĩ. Mặt phải của vách có <em>hố bầu dục (fossa ovalis)</em>, viền quanh bởi vành hố bầu dục (limbus fossae ovalis) - đây là di tích của lỗ bầu dục (foramen ovale / lỗ Botal) trong thời kỳ tuần hoàn thai nhi. Sau khi sinh, áp lực nhĩ trái tăng làm vách nguyên phát áp chặt vào vách thứ phát và thường bít kín hoàn toàn sau 2 - 3 tháng. Nếu lỗ này tồn tại sẽ tạo nên dị tật thông liên nhĩ (ASD).
      </li>
      <li>
        <strong>Vách nhĩ thất (septum atrioventriculare):</strong> Là một màng mỏng nằm giữa tâm nhĩ phải và tâm thất trái (do van ba lá bám thấp hơn van hai lá về phía mỏm tim khoảng 1cm).
      </li>
      <li>
        <strong>Vách liên thất (septum interventricularis):</strong> Ngăn giữa hai tâm thất. Vách gồm 2 phần: <em>phần cơ ở dưới</em> dày khoảng 10 mm (cong lồi sang tâm thất phải) và <em>phần màng ở trên</em> mỏng khoảng 2 mm. Vị trí tiếp giáp giữa phần cơ và phần màng là nơi hay xảy ra dị tật thông liên thất (VSD) - bệnh tim bẩm sinh phổ biến nhất.
      </li>
    </ul>
  </div>

  <!-- b) Buồng nhĩ -->
  <div class="space-y-3 mt-6">
    <h4 class="font-serif text-lg font-bold text-[#782F3B]">
      b) Buồng tâm nhĩ (atrium cordis)
    </h4>
    <p>
      Tâm nhĩ có thành cơ mỏng, bề mặt bên trong phần lớn nhẵn bóng (chỉ có các cơ lược ở phần tiểu nhĩ):
    </p>
    <ul class="list-disc pl-6 space-y-2">
      <li>
        <strong>Tâm nhĩ phải:</strong>
        <ul class="list-circle pl-6 mt-1 space-y-1 text-sm">
          <li>Thành trên: Có lỗ tĩnh mạch chủ trên (không có van).</li>
          <li>Thành sau dưới: Có lỗ tĩnh mạch chủ dưới kèm <em>van tĩnh mạch chủ dưới (valvula v. cavae inferioris - van Eustachi)</em> và lỗ xoang vành kèm <em>van xoang tĩnh mạch vành (valvula sinus coronarii - van Thebesius)</em>.</li>
          <li>Thành trước: Có lỗ nhĩ thất phải với van 3 lá.</li>
        </ul>
      </li>
      <li>
        <strong>Tâm nhĩ trái:</strong>
        <ul class="list-circle pl-6 mt-1 space-y-1 text-sm">
          <li>Thành sau trên: Có lỗ của 4 tĩnh mạch phổi (không có van).</li>
          <li>Thành trước: Có lỗ nhĩ thất trái với van 2 lá.</li>
        </ul>
      </li>
    </ul>
    <p class="text-sm italic text-[#565551]">
      Cả hai tâm nhĩ đều thông với túi nhĩ (tiểu nhĩ phải và tiểu nhĩ trái) ở thành ngoài. Tiểu nhĩ là nơi thường hình thành cục huyết khối trong rung nhĩ.
    </p>
  </div>

  <!-- FIGURE 1.5 -->
  <figure class="not-prose my-8 bg-white p-4 sm:p-6 rounded-2xl border border-[#DDD7CC] shadow-md">
    <div class="overflow-hidden rounded-xl bg-[#F8F5EE] flex justify-center items-center">
      <img
        src="/images/lessons/les-8-1-1/image5.png"
        alt="Hình 1.5. Hình thể trong tâm thất trái và van hai lá (Bản màu Atlas Y khoa)"
        class="max-h-[580px] w-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
        loading="lazy"
      />
    </div>
    <figcaption class="mt-4 text-center">
      <div class="font-serif font-bold text-sm sm:text-base text-[#30312F]">
        Hình 1.5. Hình thể trong tâm thất trái và van hai lá (Bản màu Atlas Y khoa)
      </div>
      <p class="font-sans text-xs text-[#77756F] mt-1">
        Thiết đồ buồng thất trái: Buồng nhĩ trái, van hai lá (lá trước & lá sau), hệ thống thừng gân (dây chằng), cột cơ và gờ cơ thành tim.
      </p>
    </figcaption>
    <!-- Anatomy Legend Table -->
    <div class="mt-4 pt-3 border-t border-[#E8E1D3] overflow-x-auto">
      <table class="w-full font-sans text-xs text-left">
        <thead>
          <tr class="bg-[#FAF7F0] text-[#782F3B] font-bold">
            <th class="p-2 w-12 text-center">Số</th>
            <th class="p-2">Chi tiết giải phẫu (Tiếng Việt)</th>
            <th class="p-2">Thuật ngữ danh pháp Latinh</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#E8E1D3]">
          <tr><td class="p-2 text-center font-bold text-[#782F3B]">1</td><td class="p-2 font-medium">Quai (Cung) động mạch chủ</td><td class="p-2 italic text-[#565551]">Arcus aortae</td></tr>
          <tr><td class="p-2 text-center font-bold text-[#782F3B]">2</td><td class="p-2 font-medium">Lá trong (lá trước) van hai lá</td><td class="p-2 italic text-[#565551]">Cuspis anterior</td></tr>
          <tr><td class="p-2 text-center font-bold text-[#782F3B]">3</td><td class="p-2 font-medium">Dây chằng (thừng gân) van hai lá</td><td class="p-2 italic text-[#565551]">Chordae tendineae</td></tr>
          <tr><td class="p-2 text-center font-bold text-[#782F3B]">4</td><td class="p-2 font-medium">Cột cơ trước thất trái</td><td class="p-2 italic text-[#565551]">M. papillaris anterior</td></tr>
          <tr><td class="p-2 text-center font-bold text-[#782F3B]">5</td><td class="p-2 font-medium">Gờ cơ (cầu cơ) thất trái</td><td class="p-2 italic text-[#565551]">Trabeculae carneae</td></tr>
          <tr><td class="p-2 text-center font-bold text-[#782F3B]">6</td><td class="p-2 font-medium">Cột cơ sau thất trái</td><td class="p-2 italic text-[#565551]">M. papillaris posterior</td></tr>
          <tr><td class="p-2 text-center font-bold text-[#782F3B]">7</td><td class="p-2 font-medium">Lá ngoài (lá sau) van hai lá</td><td class="p-2 italic text-[#565551]">Cuspis posterior</td></tr>
          <tr><td class="p-2 text-center font-bold text-[#782F3B]">8</td><td class="p-2 font-medium">Xoang tĩnh mạch vành</td><td class="p-2 italic text-[#565551]">Sinus coronarius</td></tr>
          <tr><td class="p-2 text-center font-bold text-[#782F3B]">9</td><td class="p-2 font-medium">Tâm nhĩ trái</td><td class="p-2 italic text-[#565551]">Atrium sinistrum</td></tr>
          <tr><td class="p-2 text-center font-bold text-[#782F3B]">10</td><td class="p-2 font-medium">Các tĩnh mạch phổi trái</td><td class="p-2 italic text-[#565551]">Vv. pulmonales sinistrae</td></tr>
          <tr><td class="p-2 text-center font-bold text-[#782F3B]">11</td><td class="p-2 font-medium">Động mạch phổi trái</td><td class="p-2 italic text-[#565551]">A. pulmonalis sinistra</td></tr>
        </tbody>
      </table>
    </div>
  </figure>

  <!-- c) Buồng thất -->
  <div class="space-y-3 mt-6">
    <h4 class="font-serif text-lg font-bold text-[#782F3B]">
      c) Buồng tâm thất (ventriculus cordis)
    </h4>
    <p>
      Thành tâm thất rất dày để tạo áp lực tống máu. Trong đó, <strong>thành tâm thất trái dày gấp 3 lần thành tâm thất phải</strong> (khoảng 8-12 mm so với 3-5 mm) do phải tống máu thắng sức cản tuần hoàn hệ thống lớn.
    </p>
    <p>
      Trong lòng buồng tâm thất có 3 dạng cấu trúc cơ đặc biệt (trabeculae carneae):
    </p>
    <ul class="list-disc pl-6 space-y-1">
      <li><strong>Cột cơ hay cơ nhú (m. papillaris):</strong> Có một đầu dính vào thành thất, đầu kia cho các thừng gân (chordae tendineae) bám vào bờ tự do của các lá van tim nhằm giữ không cho van bị lộn ngược lên tâm nhĩ trong thì tâm thu.</li>
      <li><strong>Cầu cơ:</strong> Có hai đầu bám vào thành tâm thất, phần giữa tự do trong buồng tim.</li>
      <li><strong>Gờ cơ:</strong> Là các bó cơ lồi lên từ thành cơ tim vào lòng buồng thất.</li>
    </ul>
    <p>
      Đường tống máu: Tâm thất trái có <strong>lỗ động mạch chủ (ostium aortae)</strong>; tâm thất phải có <strong>lỗ thân động mạch phổi (ostium trunci pulmonalis)</strong>. Cả hai lỗ này đều có van tổ chim (van bán nguyệt - valva semilunaris) đóng kín ngăn máu trào ngược về thất trong thì tâm trương.
    </p>
  </div>

  <!-- 1.1.4 Cấu tạo của tim -->
  <h3 class="font-serif text-xl font-bold text-[#30312F] mt-10">
    1.1.4. Cấu tạo các lớp thành tim
  </h3>
  <p>
    Thành tim gồm 3 lớp từ trong ra ngoài:
  </p>

  <div class="space-y-4 mt-3">
    <div class="p-4 rounded-xl bg-white border border-[#DDD7CC] shadow-sm">
      <h4 class="font-serif font-bold text-base text-[#782F3B]">
        a) Nội tâm mạc hay màng trong tim (endocardium)
      </h4>
      <p class="text-sm mt-1 text-[#565551]">
        Là một lớp tế bào nội mô mỏng, nhẵn bóng lót toàn bộ mặt trong các buồng tim, bao phủ các lá van, thừng gân và liên tiếp trực tiếp với lớp nội mô của các mạch máu lớn vào ra tim. <em>Viêm nội tâm mạc nhiễm khuẩn (IE)</em> thường làm sùi, loét và co kéo van tim dẫn đến hẹp hoặc hở van.
      </p>
    </div>

    <div class="p-4 rounded-xl bg-white border border-[#DDD7CC] shadow-sm">
      <h4 class="font-serif font-bold text-base text-[#782F3B]">
        b) Cơ tim (myocardium)
      </h4>
      <p class="text-sm mt-1 text-[#565551]">
        Là lớp dày nhất, cấu tạo vi thể có vân ngang giống cơ vân nhưng hoạt động tự động và không theo ý muốn như cơ trơn. Gồm 2 loại sợi cơ:
      </p>
      <ul class="list-disc pl-6 mt-2 text-sm text-[#565551] space-y-1">
        <li><strong>Sợi cơ co bóp:</strong> Đã biệt hóa hoàn toàn, bám quanh 4 vòng sợi quanh các lỗ van tim để tạo thành khung chống đỡ và co bóp tống máu.</li>
        <li><strong>Sợi cơ có tính chất thần kinh (hệ thống dẫn truyền tự động):</strong> Chưa biệt hóa hoàn toàn, chuyên biệt hóa cho chức năng phát nhịp và dẫn truyền xung động điện tim (nút SA, nút AV, bó His và mạng Purkinje).</li>
      </ul>
    </div>

    <div class="p-4 rounded-xl bg-white border border-[#DDD7CC] shadow-sm">
      <h4 class="font-serif font-bold text-base text-[#782F3B]">
        c) Ngoại tâm mạc hay màng ngoài tim (pericardium)
      </h4>
      <p class="text-sm mt-1 text-[#565551]">
        Là một túi kín bọc ngoài tim gồm 2 bao:
      </p>
      <ul class="list-disc pl-6 mt-2 text-sm text-[#565551] space-y-2">
        <li>
          <strong>Bao sợi (pericardium fibrosum):</strong> Ở ngoài cùng, cấu tạo bởi mô liên kết sợi collagen dày, dai, không đàn hồi, có các dây chằng cố định màng ngoài tim vào cơ hoành (dây chằng hoành - màng tim), xương ức (dây chằng ức - màng tim) và cột sống.
        </li>
        <li>
          <strong>Bao thanh mạc (pericardium serosum):</strong> Gồm 2 lá:
          <ul class="list-circle pl-6 mt-1 space-y-1">
            <li><em>Lá tạng (lamina visceralis / epicardium):</em> Dính chặt trực tiếp vào bề mặt ngoài cơ tim.</li>
            <li><em>Lá thành (lamina parietalis):</em> Lót mặt trong bao sợi.</li>
          </ul>
        </li>
        <li>
          <strong>Khoang ngoại tâm mạc (cavum pericardii):</strong> Là khoang ảo giữa lá thành và lá tạng, chứa 15 - 30 ml thanh dịch bôi trơn giúp hai lá trượt lên nhau êm ái khi tim co bóp. Khi viêm màng ngoài tim tràn dịch, dịch có thể tích tụ từ <strong>2 đến 3 lít</strong>. Nếu dịch tăng nhanh sẽ gây hội chứng ép tim cấp (Cardiac Tamponade).
        </li>
        <li>
          <strong>Các xoang màng tim (túi bịt):</strong>
          <ul class="list-circle pl-6 mt-1 space-y-1">
            <li><em>Xoang chếch (sinus obliquus pericardii - túi bịt Haller):</em> Nằm ở sau tâm nhĩ trái, giữa các tĩnh mạch phổi, liên quan phía sau với thực quản.</li>
            <li><em>Xoang ngang (sinus transversus pericardii - xoang Theillé):</em> Nằm ngang sau thân ĐM phổi và ĐM chủ lên, phía trước tĩnh mạch chủ trên và tâm nhĩ.</li>
          </ul>
        </li>
      </ul>
    </div>
  </div>

  <!-- SECTION 1.3 -->
  <h2 class="font-serif text-2xl font-bold text-[#782F3B] border-b border-[#DDD7CC] pb-2 mt-12">
    1.3. Mạch máu và thần kinh chi phối tim
  </h2>

  <!-- 1.3.1 Mạch máu nuôi tim -->
  <h3 class="font-serif text-xl font-bold text-[#30312F] mt-6">
    1.3.1. Mạch máu nuôi tim (Hệ tuần hoàn vành)
  </h3>

  <div class="space-y-3 mt-4">
    <h4 class="font-serif text-lg font-bold text-[#782F3B]">
      a) Động mạch vành (Arteriae coronariae)
    </h4>
    <p>
      Tim được nuôi dưỡng bởi hai động mạch: <strong>động mạch vành phải</strong> và <strong>động mạch vành trái</strong>. Cả hai đều xuất phát từ <em>xoang động mạch chủ (xoang Valsalva)</em> ngay phía trên các lá van tổ chim của động mạch chủ.
    </p>
    <div class="p-3 bg-[#FAF7F0] border-l-4 border-amber-600 text-xs sm:text-sm font-sans text-[#565551] rounded-r-lg">
      <strong class="text-amber-900">Đặc điểm huyết động học duy nhất:</strong> Động mạch vành là hệ thống động mạch duy nhất trong cơ thể <strong>nhận máu chủ yếu trong thì tâm trương</strong> (khi cơ thất giãn ra, van tổ chim đóng lại và cơ tim không còn chèn ép các mao mạch trong cơ tim).
    </div>

    <!-- FIGURE 1.6 -->
    <figure class="not-prose my-8 bg-white p-4 sm:p-6 rounded-2xl border border-[#DDD7CC] shadow-md">
      <div class="overflow-hidden rounded-xl bg-[#F8F5EE] flex justify-center items-center">
        <img
          src="/images/lessons/les-8-1-1/image6.png"
          alt="Hình 1.6. Hệ thống động mạch vành tim — Mặt trước (Atlas Blausen 0260)"
          class="max-h-[580px] w-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
          loading="lazy"
        />
      </div>
      <figcaption class="mt-4 text-center">
        <div class="font-serif font-bold text-sm sm:text-base text-[#30312F]">
          Hình 1.6. Hệ thống động mạch vành tim — Mặt trước (Bản màu Atlas Blausen 0260)
        </div>
      </figcaption>
      <!-- Anatomy Legend Table -->
      <div class="mt-4 pt-3 border-t border-[#E8E1D3] overflow-x-auto">
        <table class="w-full font-sans text-xs text-left">
          <thead>
            <tr class="bg-[#FAF7F0] text-[#782F3B] font-bold">
              <th class="p-2 w-12 text-center">Số</th>
              <th class="p-2">Chi tiết giải phẫu (Tiếng Việt)</th>
              <th class="p-2">Thuật ngữ danh pháp Latinh</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E8E1D3]">
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">1</td><td class="p-2 font-medium">Nhánh nút xoang nhĩ</td><td class="p-2 italic text-[#565551]">R. nodi sinuatrialis</td></tr>
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">2</td><td class="p-2 font-medium">Động mạch vành phải</td><td class="p-2 italic text-[#565551]">A. coronaria dextra (RCA)</td></tr>
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">3</td><td class="p-2 font-medium">Tâm nhĩ phải</td><td class="p-2 italic text-[#565551]">Atrium dextrum</td></tr>
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">4</td><td class="p-2 font-medium">Tâm thất phải</td><td class="p-2 italic text-[#565551]">Ventriculus dexter</td></tr>
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">5</td><td class="p-2 font-medium">Nhánh bờ phải (nhánh rịa)</td><td class="p-2 italic text-[#565551]">R. marginalis dexter</td></tr>
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">6</td><td class="p-2 font-medium">Nhánh gian thất sau</td><td class="p-2 italic text-[#565551]">R. interventricularis posterior</td></tr>
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">7</td><td class="p-2 font-medium">Nhánh chéo (nhánh chếch)</td><td class="p-2 italic text-[#565551]">R. diagonalis</td></tr>
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">8</td><td class="p-2 font-medium">Tâm thất trái</td><td class="p-2 italic text-[#565551]">Ventriculus sinister</td></tr>
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">9</td><td class="p-2 font-medium">Nhánh gian thất trước (ĐM liên thất trước)</td><td class="p-2 italic text-[#565551]">R. interventricularis anterior (LAD)</td></tr>
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">10</td><td class="p-2 font-medium">Nhánh bờ trái của nhánh mũ</td><td class="p-2 italic text-[#565551]">R. marginalis sinister</td></tr>
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">11</td><td class="p-2 font-medium">Nhánh mũ</td><td class="p-2 italic text-[#565551]">R. circumflexus (LCx)</td></tr>
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">12</td><td class="p-2 font-medium">Tâm nhĩ trái (tiểu nhĩ trái)</td><td class="p-2 italic text-[#565551]">Auricula / Atrium sinistrum</td></tr>
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">13</td><td class="p-2 font-medium">Động mạch vành trái (Thân chung LMCA)</td><td class="p-2 italic text-[#565551]">A. coronaria sinistra (LMCA)</td></tr>
          </tbody>
        </table>
      </div>
    </figure>

    <p>
      <strong>Chi tiết phân nhánh:</strong>
    </p>
    <ul class="list-disc pl-6 space-y-2">
      <li>
        <strong>Động mạch vành phải (a. coronaria dextra):</strong> Chạy trong rãnh vành phải ra mặt sau tim, tận cùng bằng <em>nhánh liên thất sau (ramus interventricularis posterior)</em> chạy trong rãnh liên thất sau tới mỏm tim. ĐM vành phải cấp máu cho nhĩ phải, thất phải, 1/3 sau vách liên thất và nút xoang (60% trường hợp), nút nhĩ thất (80-90% trường hợp).
      </li>
      <li>
        <strong>Động mạch vành trái (a. coronaria sinistra):</strong> Sau khi chạy ra từ sau thân ĐM phổi thì chia thành 2 nhánh lớn:
        <ul class="list-circle pl-6 mt-1 space-y-1">
          <li><em>Nhánh liên thất trước (LAD - ramus interventricularis anterior):</em> Chạy trong rãnh liên thất trước tới đỉnh tim, cấp máu cho thất trái, thất phải và 2/3 trước vách liên thất (đây là nhánh quan trọng nhất, tắc LAD gây nhồi máu cơ tim trước vách đe dọa tử vong cao).</li>
          <li><em>Nhánh mũ (LCx - ramus circumflexus):</em> Chạy vòng sang trái trong rãnh vành ra mặt sau, cấp máu cho tâm nhĩ trái và thành bên, thành sau thất trái.</li>
        </ul>
      </li>
    </ul>

    <div class="p-3 bg-red-50 border-l-4 border-red-600 text-xs sm:text-sm font-sans text-red-950 rounded-r-lg">
      <strong>Lưu ý giải phẫu lâm sàng:</strong> Các nhánh tận của động mạch vành chỉ nối với nhau ở mạng mao mạch mỏm tim mà <strong>hầu như không có vòng nối chức năng với các hệ động mạch ngoài tim lân cận</strong>. Do đó, khi một nhánh động mạch vành bị tắc đột ngột do huyết khối, vùng cơ tim do nhánh đó chi phối sẽ rơi vào hoại tử thiếu máu cấp (Nhồi máu cơ tim cấp - Acute Myocardial Infarction).
    </div>

    <h4 class="font-serif text-lg font-bold text-[#782F3B] mt-6">
      b) Tĩnh mạch tim
    </h4>
    <p>
      Các tĩnh mạch tim đi kèm theo các nhánh động mạch và gom máu đổ về <strong>xoang tĩnh mạch vành (sinus coronarius)</strong> nằm trong rãnh vành ở mặt dưới tim:
    </p>
    <ul class="list-disc pl-6 space-y-1 text-sm">
      <li><em>Tĩnh mạch tim lớn (v. cordis magna):</em> Đi từ rãnh liên thất trước sang rãnh vành trái vào xoang vành.</li>
      <li><em>Tĩnh mạch tim giữa (v. cordis media):</em> Đi trong rãnh liên thất sau đổ vào xoang vành.</li>
      <li><em>Tĩnh mạch tim nhỏ (v. cordis parva):</em> Đi ở rãnh vành phải đổ vào xoang vành.</li>
      <li>Xoang vành phình lớn và mở trực tiếp vào tâm nhĩ phải qua lỗ xoang vành có van Thebesius.</li>
    </ul>
  </div>

  <!-- 1.3.2 Thần kinh chi phối tim -->
  <h3 class="font-serif text-xl font-bold text-[#30312F] mt-10">
    1.3.2. Thần kinh chi phối tim
  </h3>
  <p>
    Tim được điều hòa bởi hai hệ thống thần kinh song hành: hệ tự động nội tại và hệ thần kinh thực vật ngoại lai.
  </p>

  <!-- a) Hệ tự động -->
  <div class="space-y-3 mt-4">
    <h4 class="font-serif text-lg font-bold text-[#782F3B]">
      a) Hệ thống thần kinh tự động nội tại của tim
    </h4>
    <p>
      Gồm các bó tế bào cơ tim biệt hóa có tính tự kích thích và dẫn truyền xung động điện học:
    </p>

    <!-- FIGURE 1.7 -->
    <figure class="not-prose my-8 bg-white p-4 sm:p-6 rounded-2xl border border-[#DDD7CC] shadow-md">
      <div class="overflow-hidden rounded-xl bg-[#F8F5EE] flex justify-center items-center">
        <img
          src="/images/lessons/les-8-1-1/image7.png"
          alt="Hình 1.7 (1.13). Hệ thần kinh tự động tim (Atlas Blausen 0338)"
          class="max-h-[580px] w-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
          loading="lazy"
        />
      </div>
      <figcaption class="mt-4 text-center">
        <div class="font-serif font-bold text-sm sm:text-base text-[#30312F]">
          Hình 1.7 (1.13). Hệ thần kinh tự động tim (Bản màu Atlas Y khoa Blausen 0338)
        </div>
        <p class="font-sans text-xs text-[#77756F] mt-1">
          Hệ thống phát nhịp và dẫn truyền xung động điện học trong tim theo trình tự: SA → AV → Bó His → Nhánh T/P → Mạng Purkinje.
        </p>
      </figcaption>
      <!-- Anatomy Legend Table -->
      <div class="mt-4 pt-3 border-t border-[#E8E1D3] overflow-x-auto">
        <table class="w-full font-sans text-xs text-left">
          <thead>
            <tr class="bg-[#FAF7F0] text-[#782F3B] font-bold">
              <th class="p-2 w-12 text-center">Số</th>
              <th class="p-2">Cấu trúc dẫn truyền (Tiếng Việt)</th>
              <th class="p-2">Danh pháp quốc tế Latinh</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E8E1D3]">
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">1</td><td class="p-2 font-medium">Nút xoang nhĩ (Nút SA / Nút Keith - Flack)</td><td class="p-2 italic text-[#565551]">Nodus sinuatrialis</td></tr>
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">2</td><td class="p-2 font-medium">Nút nhĩ thất (Nút AV / Nút Aschoff - Tawara)</td><td class="p-2 italic text-[#565551]">Nodus atrioventricularis</td></tr>
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">3</td><td class="p-2 font-medium">Bó His (Bó nhĩ thất)</td><td class="p-2 italic text-[#565551]">Fasciculus atrioventricularis</td></tr>
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">4</td><td class="p-2 font-medium">Nhánh bó trái (Trụ trái bó His)</td><td class="p-2 italic text-[#565551]">Crus sinistrum</td></tr>
            <tr><td class="p-2 text-center font-bold text-[#782F3B]">5</td><td class="p-2 font-medium">Nhánh bó phải & Mạng Purkinje</td><td class="p-2 italic text-[#565551]">Crus dextrum & Rami subendocardiales</td></tr>
          </tbody>
        </table>
      </div>
    </figure>

    <ul class="list-disc pl-6 space-y-2">
      <li>
        <strong>Nút xoang nhĩ (nodus sinuatrialis - SA / Keith-Flack):</strong> Nằm ở thành sau tâm nhĩ phải, cạnh lỗ tĩnh mạch chủ trên. Đây là <em>chủ nhịp sinh lý tự nhiên của tim</em>, phát nhịp với tần số 60 - 100 lần/phút.
      </li>
      <li>
        <strong>Nút nhĩ thất (nodus atrioventricularis - AV / Aschoff-Tawara):</strong> Nằm ở mặt phải phần dưới vách liên nhĩ, ngay trước lỗ xoang tĩnh mạch vành và trên lá trong van 3 lá (Tam giác Koch). Tốc độ dẫn truyền qua nút AV bị làm chậm khoảng 0.1s để tâm nhĩ kịp bơm hết máu xuống thất trước khi thất co.
      </li>
      <li>
        <strong>Bó nhĩ thất (fasciculus atrioventricularis - bó His):</strong> Đi từ nút AV chui qua màng sợi nhĩ thất vào vách liên thất.
      </li>
      <li>
        <strong>Nhánh bó phải và bó trái (crus dextrum et sinistrum):</strong> Tách ra từ bó His, chạy dưới nội tâm mạc hai bên vách liên thất, chia nhánh tỏa ra tạo nên <strong>mạng sợi Purkinje (rami subendocardiales)</strong> đan xen vào cơ tâm thất để kích thích tâm thất co đồng thì.
      </li>
    </ul>
  </div>

  <!-- b) Hệ thực vật -->
  <div class="space-y-3 mt-6">
    <h4 class="font-serif text-lg font-bold text-[#782F3B]">
      b) Hệ thần kinh thực vật ngoại lai
    </h4>
    <p>
      Gồm các sợi thần kinh tự chủ điều hòa tần số và lực co bóp cơ tim:
    </p>
    <ul class="list-disc pl-6 space-y-2">
      <li>
        <strong>Hệ giao cảm:</strong> Xuất phát từ 3 hạch giao cảm cổ (hạch cổ trên, cổ giữa và cổ dưới / hạch sao) cho ra các nhánh thần kinh tim trên, giữa, dưới (nn. cardiaci cervicales superior, medius, inferior). Kích thích giao cảm phóng thích Norepinephrine làm <em>tăng nhịp tim, tăng tốc độ dẫn truyền và tăng co bóp cơ tim</em>.
      </li>
      <li>
        <strong>Hệ đối giao cảm (phó giao cảm):</strong> Do <strong>dây thần kinh lang thang (thần kinh X - n. vagus)</strong> phân nhánh tới đám rối tim. Kích thích dây X phóng thích Acetylcholine làm <em>giảm nhịp tim và giảm trương lực tim</em>.
      </li>
      <li>
        Các nhánh này hòa lẫn tạo thành <strong>đám rối tim (plexus cardiacus)</strong> dưới quai động mạch chủ, trong đó có <em>hạch tim Wrisberg (ganglion cardiacum)</em>.
      </li>
    </ul>
  </div>

  <!-- REVIEW & CLINICAL QUESTIONS -->
  <div class="not-prose my-10 p-6 rounded-2xl bg-[#F8F5EE] border-2 border-[#782F3B]/30 shadow-md space-y-4 font-sans">
    <div class="flex items-center gap-2 text-[#782F3B]">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <h3 class="font-serif font-bold text-lg text-[#30312F]">Câu hỏi tự lượng giá & Ôn tập bài giảng</h3>
    </div>

    <div class="space-y-3 text-xs sm:text-sm text-[#565551]">
      <div class="p-3 bg-white rounded-xl border border-[#DDD7CC]">
        <strong>Câu 1:</strong> Trình bày vị trí, hình thể ngoài (3 mặt, 1 nền, 1 đỉnh) và các liên quan giải phẫu quan trọng của tim?
      </div>
      <div class="p-3 bg-white rounded-xl border border-[#DDD7CC]">
        <strong>Câu 2:</strong> Mô tả hình thể trong (các buồng tim, vách ngăn, các van tim) và cấu tạo 3 lớp thành tim? Giải thích cơ chế bệnh sinh của thông liên thất và viêm nội tâm mạc nhiễm khuẩn.
      </div>
      <div class="p-3 bg-white rounded-xl border border-[#DDD7CC]">
        <strong>Câu 3:</strong> Trình bày đường đi, phân nhánh của động mạch vành phải và trái; mô tả hệ thần kinh tự động nội tại của tim và vận dụng giải thích các vị trí ổ nghe van tim trên thành ngực.
      </div>
    </div>
  </div>

</div>
`,
};
