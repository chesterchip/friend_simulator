/**
 * Emotion Spider Diagram component for visualizing emotion scores
 */

// Create the component using React
const EmotionSpiderDiagram = () => {
  const [emotionScores, setEmotionScores] = React.useState({
    anger: 10,
    happy: 10, 
    peaceful: 10, 
    fear: 10, 
    sad: 10, 
    surprise: 10, 
    neutral: 80
  });
  
  React.useEffect(() => {
    // Function to update the chart when emotions change
    const updateEmotionScores = () => {
      // Get current emotions from the EmotionAnalyzer
      if (window.EmotionAnalyzer) {
        const emotionState = window.EmotionAnalyzer.getCurrentState();
        if (emotionState && emotionState.emotionScores) {
          setEmotionScores(emotionState.emotionScores);
        }
      }
    };
    
    // Set up an interval to check for emotion changes
    const intervalId = setInterval(updateEmotionScores, 300);
    
    // Listen for emotion updates events
    const handleEmotionUpdate = (event) => {
      if (event.detail) {
        setEmotionScores(event.detail);
      }
    };
    
    window.addEventListener('emotionScoresUpdated', handleEmotionUpdate);
    
    // Initial update
    updateEmotionScores();
    
    // Clean up interval and event listener on component unmount
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('emotionScoresUpdated', handleEmotionUpdate);
    };
  }, []);

  // Format data for the radar chart
  const formatData = () => {
    return Object.keys(emotionScores).map(emotion => {
      // Get the hex color from the Config for this emotion
      const bgColor = window.Config && window.Config.emotions[emotion] 
        ? window.Config.emotions[emotion].bg 
        : '#000000';
      
      return {
        emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
        value: emotionScores[emotion],
        fill: bgColor,
        stroke: bgColor
      };
    });
  };

  // Prepare the data for the radar chart
  const data = formatData();
  
  // Get the detected emotion (highest score)
  const primaryEmotion = Object.keys(emotionScores).reduce(
    (a, b) => emotionScores[a] > emotionScores[b] ? a : b
  );
  
  // Get the second highest emotion
  const secondaryEmotion = Object.keys(emotionScores)
    .filter(emotion => emotion !== primaryEmotion)
    .reduce((a, b) => emotionScores[a] > emotionScores[b] ? a : b);
  
  // Get colors for primary and secondary emotions
  const primaryColor = window.Config && window.Config.emotions[primaryEmotion] 
    ? window.Config.emotions[primaryEmotion].bg 
    : '#D54A4A';
  
  const secondaryColor = window.Config && window.Config.emotions[secondaryEmotion] 
    ? window.Config.emotions[secondaryEmotion].bg 
    : '#4CAF50';

  const { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } = Recharts;

  return React.createElement(
    'div',
    { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', backgroundColor: '#2a2a2a', padding: '16px', borderRadius: '8px', color: '#ccc' } },
    [
      // Title
      React.createElement(
        'h3',
        { style: { fontSize: '16px', fontWeight: 'bold', margin: '0' } },
        'Emotion Analysis'
      ),
      
      // Radar Chart
      React.createElement(
        'div',
        { style: { width: '100%', height: '220px' } },
        React.createElement(
          ResponsiveContainer,
          { width: '100%', height: '100%' },
          React.createElement(
            RadarChart,
            { outerRadius: '80%', data: data },
            [
              React.createElement(PolarGrid, { stroke: '#444' }),
              React.createElement(PolarAngleAxis, { 
                dataKey: 'emotion', 
                tick: { fill: '#ccc', fontSize: 12 } 
              }),
              React.createElement(PolarRadiusAxis, { 
                angle: 90, 
                domain: [0, 100], 
                tick: { fill: '#ccc', fontSize: 10 } 
              }),
              React.createElement(Radar, { 
                name: 'Emotions', 
                dataKey: 'value', 
                stroke: primaryColor, 
                fill: primaryColor, 
                fillOpacity: 0.4 
              })
            ]
          )
        )
      ),
      
      // Primary Emotion Display
      React.createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' } },
        [
          React.createElement(
            'div',
            { style: { textAlign: 'center' } },
            [
              React.createElement('span', {}, 'Primary: '),
              React.createElement(
                'span',
                { 
                  style: { 
                    fontWeight: 'bold', 
                    backgroundColor: primaryColor, 
                    padding: '4px 8px', 
                    borderRadius: '4px' 
                  } 
                },
                `${primaryEmotion.charAt(0).toUpperCase() + primaryEmotion.slice(1)} (${Math.round(emotionScores[primaryEmotion])}%)`
              )
            ]
          ),
          
          // Secondary Emotion Display
          React.createElement(
            'div',
            { style: { textAlign: 'center' } },
            [
              React.createElement('span', {}, 'Secondary: '),
              React.createElement(
                'span',
                { 
                  style: { 
                    fontWeight: 'bold', 
                    backgroundColor: secondaryColor, 
                    padding: '4px 8px', 
                    borderRadius: '4px' 
                  } 
                },
                `${secondaryEmotion.charAt(0).toUpperCase() + secondaryEmotion.slice(1)} (${Math.round(emotionScores[secondaryEmotion])}%)`
              )
            ]
          )
        ]
      )
    ]
  );
};

// Make the component available globally
window.EmotionSpiderDiagram = EmotionSpiderDiagram;