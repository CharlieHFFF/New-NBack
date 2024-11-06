import { JsPsych } from "jspsych";
import jsPsychHtmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response'

export function createTimeline(jsPsych: JsPsych,
  stimuli: any,
  keyboard_response: string = "space",          // Default key for response
  trial_duration: number = 1000,                // Default trial duration in ms
  post_trial_gap: number = 500,                 // Default gap between trials in ms
  fixation_duration: number = 500,              // Default fixation duration in ms
  n: number = 2,                                // Default value for N-back level
  num_trials: number = 20,                      // Default number of trials
  rep_ratio: number = 0.2) {

  const trial_sequence: any[] = [];

  for (var i = 0; i < num_trials; i++) {
    if (i >= n && Math.random() < rep_ratio) {
        trial_sequence.push(trial_sequence[i - n]);
    } else {
        const possible_stimuli = stimuli.filter(function (s: any) {
          return (i < n || s !== trial_sequence[i - n]);
        });
        const random_stimulus = jsPsych.randomization.sampleWithoutReplacement(possible_stimuli, 1)[0];
        trial_sequence.push(random_stimulus)
      }
    }

  const timeline: any[] = [];

  for (var i = 0; i < trial_sequence.length; i++) {

    timeline.push({
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `<p style="font-size: 48px; color: gray;">+</p>`,
      choices: "NO_KEYS",
      trial_duration: fixation_duration
    });

    timeline.push({
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `<p style="font-size: 48px;">${trial_sequence[i]}</p>`,
      choices: [keyboard_response],
      trial_duration: trial_duration,
      post_trial_gap: post_trial_gap,
      data: { correct: i >= 2 && trial_sequence[i] === trial_sequence[i - n] },
      on_finish: function (data: any) {
        data.correct_response = data.correct && data.response === keyboard_response;
        data.correct_no_response = !data.correct && data.response === null;
      }
    })
  }

  return timeline
}

export default createTimeline