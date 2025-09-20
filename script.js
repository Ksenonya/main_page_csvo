// снять no-js, когда скрипты стартовали
document.documentElement.classList.remove('no-js');

// Плавное появление секций
(() => {
  const items = document.querySelectorAll('.item');
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(i => io.observe(i));
})();



// ---- График t1 (пирамида) ----
if (window.ChartDataLabels) Chart.register(ChartDataLabels);

const elPyr = document.getElementById('pyramidChart');
if (elPyr) {
  const ctx = elPyr.getContext('2d');
  const fmt = new Intl.NumberFormat('ru-RU');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['До 24', '25–29', '30–34', '35–39', '40 и старше'], // снизу вверх
      datasets: [
        {
          label: 'Мужчины',
          data: [-12735, -34536, -9492, -7556, -7648], // слева => отрицательные
          backgroundColor: '#7FCDF4',
          borderRadius: 10,
          barThickness: 26,
          stack: 's'
        },
        {
          label: 'Женщины',
          data: [4142, 19079, 6060, 3825, 4632],
          backgroundColor: '#FF7AAE',
          borderRadius: 10,
          barThickness: 26,
          stack: 's'
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { color:'#0C1C4D', usePointStyle:true, pointStyle:'rectRounded', font:{ size:13, weight:'600' } }
        },
        title: { display: false },
        datalabels: window.ChartDataLabels ? {
          color:'#0C1C4D',
          anchor: ctx => ctx.raw < 0 ? 'end' : 'start',
          align:  ctx => ctx.raw < 0 ? 'left' : 'right',
          formatter: v => fmt.format(Math.abs(v)),
          font:{ size:12, weight:'600' },
          clamp:true, clip:true
        } : undefined,
        tooltip: {
          backgroundColor:'#0C1C4D', titleColor:'#fff', bodyColor:'#fff',
          padding:12, borderColor:'#0C1C4D', borderWidth:1,
          callbacks: {
            title: items => `Возраст: ${items[0].label}`,
            label: item => `${item.dataset.label}: ${fmt.format(Math.abs(item.raw))} чел.`
          }
        }
      },
      scales: {
        y: {
          stacked: true,
          reverse: true, // возраст снизу вверх
          grid: { color:'rgba(12,28,77,0.08)' },
          ticks: { color:'#0C1C4D', font:{ size:14 } }
        },
        x: {
          stacked: true,
          grid: { color:'rgba(12,28,77,0.10)' },
          ticks: {
            color:'#0C1C4D',
            font:{ size:14, weight:'600' },
            callback: v => fmt.format(Math.abs(v))
          },
          title: { display:true, text:'Человек', color:'#0C1C4D', font:{ size:14, weight:'600' } }
        }
      },
      animation: { duration: 1200, easing: 'easeOutCubic' }
    }
  });
}

// ---- График t2 ----
if (window.ChartDataLabels) Chart.register(ChartDataLabels);
const elT2 = document.getElementById('t2Chart');
if (elT2) {
  const ctx = elT2.getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [
        'Получить степень кандидата наук','Улучшить исследовательские навыки',
        'Улучшить преподавательские навыки','Продолжить заниматься интересующей темой',
        'Продвинуться по карьерной лестнице в академии','Получить отсрочку от армии *',
        'Устроиться на работу в своем вузе','Продвинуться по карьерной лестнице вне академии',
        'Пройти стажировку за рубежом','Получить место в общежитии'
      ],
      datasets: [{
        label: 'Доля аспирантов (%)',
        data: [87,64,48,44,40,29,28,18,12,4],
        backgroundColor: 'rgba(127,205,244,1)',
        borderRadius: 10,
        barThickness: 26
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display:false },
        title: {
          display:true, text:'Мотивы поступающих в аспирантуру',
          color:'#0C1C4D', font:{ size:20, weight:'bold' }, padding:{ top:10, bottom:20 }
        },
        datalabels: window.ChartDataLabels ? {
          color:'#0C1C4D', anchor:'end', align:'right',
          font:{ size:14, weight:'600' }, formatter:v => v + '%'
        } : undefined,
        tooltip: {
          backgroundColor:'#0C1C4D', titleColor:'#fff', bodyColor:'#fff',
          padding:12, borderColor:'#0C1C4D', borderWidth:1
        }
      },
      scales: {
        x: { ticks:{ color:'#0C1C4D', font:{ size:14, weight:'600' } }, grid:{ color:'rgba(12,28,77,0.1)' } },
        y: { ticks:{ color:'#0C1C4D', font:{ size:14 } }, grid:{ display:false } }
      },
      animation: { duration: 1200, easing: 'easeOutCubic' }
    }
  });
}

// ---- Слайдер t4 (pie + bar) ----
(() => {
  const slider = document.querySelector('#t4 .slider');
  const c1 = document.getElementById('t4Chart1');
  const c2 = document.getElementById('t4Chart2');
  if (!slider || !c1 || !c2) return;

  // цвета
  const css = getComputedStyle(document.documentElement);
  const primary = (css.getPropertyValue('--primary') || '#1977FF').trim();
  const ink     = (css.getPropertyValue('--ink') || '#0C1C4D').trim();

  // палитры PIE
  const pieBase = ['#1d3557','#457b9d','#a8dadc','#f1faee','#e63946','#780000'];
  const pieDim  = ['rgba(29,53,87,.18)','rgba(69,123,157,.18)','rgba(168,218,220,.18)',
                   'rgba(241,250,238,.35)','rgba(230,57,70,.18)','rgba(120,0,0,.18)'];

  const charts = [];

  // PIE
  const pie = new Chart(c1.getContext('2d'), {
    type:'pie',
    data:{
      labels:['Супергерой','Наставник в исслед. практике','Не вмешивающийся','Ментор','Консультант','Партнёр по диалогу'],
      datasets:[{
        data:[22,18,16,16,15,13],
        backgroundColor:(ctx)=>{
          const i = ctx.dataIndex, hovered = ctx.chart.$hoveredIndex;
          return hovered==null ? pieBase[i] : (i===hovered ? pieBase[i] : pieDim[i]);
        },
        borderWidth:0, hoverOffset:10
      }]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      animation:{ duration:900, easing:'easeOutCubic', animateRotate:true, animateScale:true },
      onHover(_e, active, chart){ chart.$hoveredIndex = active?.[0]?.index ?? null; chart.update(); },
      plugins:{
        legend:{
          position:'right', labels:{ color:ink },
          onHover(_e,item,legend){ const ch=legend.chart; ch.$hoveredIndex=item.index; ch.update(); },
          onLeave(_e,_item,legend){ const ch=legend.chart; ch.$hoveredIndex=null; ch.update(); }
        },
        title:{ display:true, text:'Типы научных руководителей', color:ink, font:{ size:18, weight:'bold' }, padding:{ top:6, bottom:16 } },
        datalabels: window.ChartDataLabels ? {
          color:'#fff', font:{ weight:'700', size:12 }, formatter:v=>v+'%',
          offset:(ctx)=>ctx.dataset.data[ctx.dataIndex]<8?6:0,
          align:(ctx)=>ctx.dataset.data[ctx.dataIndex]<8?'end':'center'
        } : undefined
      }
    }
  });
  // корректный «leave» у canvas
  pie.canvas.addEventListener('mouseleave', () => { pie.$hoveredIndex=null; pie.update(); });
  charts[0] = pie;

  // BAR
  charts[1] = new Chart(c2.getContext('2d'), {
    type:'bar',
    data:{
      labels:['Только рук-ль','Рук-ль + кафедра','Только кафедра','Нет поддержки'],
      datasets:[{ data:[54,71,42,28], backgroundColor:primary, borderRadius:8, barThickness:26 }]
    },
    options:{
      indexAxis:'y', responsive:true, maintainAspectRatio:false,
      plugins:{
        legend:{ display:false },
        title:{ display:true, text:'Доля уверенных в защите', color:ink, font:{ size:18, weight:'bold' }, padding:{ top:6, bottom:16 } }
      },
      scales:{
        x:{ ticks:{ color:ink, font:{ size:13, weight:'600' } }, grid:{ color:'rgba(12,28,77,0.1)' } },
        y:{ ticks:{ color:ink, font:{ size:13 } }, grid:{ display:false } }
      },
      animation:{ duration:900, easing:'easeOutCubic' }
    }
  });

  // ---- Переключение слайдов (с защитой) ----
  const slides = slider.querySelectorAll('.slide');
  const controls = slider.querySelector('.slider-controls');

  if (!slides.length || !controls) return; // нет DOM — тихо выходим

  const prev = controls.querySelector('.prev');
  const next = controls.querySelector('.next');
  const dots = controls.querySelectorAll('.dot');

  let idx = 0;
  const show = (i)=>{
    idx = (i + slides.length) % slides.length;
    slides.forEach((s,k)=>{
      const active = k===idx;
      s.setAttribute('aria-hidden', String(!active));
      s.style.display = active ? 'block':'none';
    });
    dots.forEach((d,k)=>{
      d.classList.toggle('is-active', k===idx);
      d.setAttribute('aria-selected', String(k===idx));
    });
    // перерисовываем активный график (важно для скрытых контейнеров)
    const ch = charts[idx];
    if (ch) { ch.resize(); ch.update(); }
  };

  prev?.addEventListener('click', e=>{ e.preventDefault(); show(idx-1); });
  next?.addEventListener('click', e=>{ e.preventDefault(); show(idx+1); });
  dots.forEach(d=> d.addEventListener('click', e=>{ e.preventDefault(); const go = +d.dataset.go; if (!Number.isNaN(go)) show(go); }));

  // первый показ
  show(0);
})();


// t5 — график в пятом тезисе
const t5 = document.getElementById('t5Chart');
if (t5) {
  const ctx2 = t5.getContext('2d');

  // цвета из CSS-переменных
  const css = getComputedStyle(document.documentElement);
  const primary = (css.getPropertyValue('--primary') || '#1977FF').trim();
  const soft    = (css.getPropertyValue('--primary-soft') || '#7FCDF4').trim();

  new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: [
        'Полный рабочий день вне вуза',
        'Полный рабочий день в вузе',
        'Больше двух работ',
        'Нет работы',
        'Неполный рабочий день в вузе',
        'Неполный рабочий день вне вуза',
        'Нерегулярная занятость внутри и вне вуза'
      ],
      datasets: [{
        label: 'Доля со стажировкой (%)',
        data: [34, 17, 16, 10, 9, 7, 7], // твои числа
        backgroundColor: soft,           // можешь поменять на primary
        borderRadius: 8,
        barThickness: 28
      }]
    },
    options: {
      indexAxis: 'y',                    // горизонтальные колонки
      responsive: true,
      maintainAspectRatio: false,        // берём высоту из CSS
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Типы трудовой занятости аспирантов',
          color: '#0C1C4D',
          font: { size: 20, weight: 'bold' },
          padding: { top: 6, bottom: 16 }
        },
        // покажем подписи на столбцах, если datalabels подключён
        datalabels: window.ChartDataLabels ? {
          color: '#0C1C4D',
          anchor: 'end',
          align: 'right',
          offset: 6,
          formatter: (v) => v + '%',
          font: { size: 13, weight: '600' }
        } : undefined,
        tooltip: {
          backgroundColor: '#0C1C4D',
          titleColor: '#fff',
          bodyColor: '#fff',
          padding: 10,
          borderColor: '#0C1C4D',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          ticks: { color: '#0C1C4D', font: { size: 13, weight: '600' } },
          grid: { color: 'rgba(12,28,77,0.1)' }
        },
        y: {
          ticks: { color: '#0C1C4D', font: { size: 13 } },
          grid: { display: false }
        }
      },
      animation: { duration: 1000, easing: 'easeOutCubic' }
    }
  });
}