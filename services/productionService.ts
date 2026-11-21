import { StudyContext } from "../types";

/**
 * Maps a Bible Study session to an OpenMontage production brief.
 * This acts as the 'Bridge' between the IBS method and the production pipelines.
 */
export const mapStudyToProductionBrief = (context: StudyContext): any => {
  // Extract the core "DNA" of the study
  const theme = context.themes[0] || "Spiritual Growth";
  const observations = context.observations.join(". ");
  const interpretations = context.interpretations.join(". ");

  // Map to an OpenMontage 'animated-explainer' style brief
  return {
    project_name: `study-summary-${Date.now()}`,
    pipeline_type: "animated-explainer",
    brief: {
      title: `Reflection: ${theme}`,
      description: `A summary of the Bible study on ${context.passage}. 
        Key points: ${observations.substring(0, 200)}.
        Theological Focus: ${interpretations.substring(0, 200)}.`,
      visual_style: "premium-minimalist",
      target_duration: 60,
      deliverable_promise: "A contemplative, high-quality summary animation for personal reflection."
    },
    // Inject metadata for the production agent
    metadata: {
      source_context: "IBS_Study_Session",
      is_reflection: true,
      input_data: {
        observations: context.observations,
        interpretations: context.interpretations,
        themes: context.themes
      }
    }
  };
};

/**
 * Simulates the hand-off to the OpenMontage Orchestrator.
 * In production, this will call the OpenMontage CLI or API.
 */
export const initiateProduction = async (context: StudyContext) => {
  const brief = mapStudyToProductionBrief(context);
  console.log("Initiating OpenMontage production for:", brief.project_name);
  
  // Placeholder for the actual API call to the OpenMontage agent
  // This would typically be a fetch call to the hermes-agent/gateway
  return {
    status: "initiated",
    project_id: brief.project_name,
    message: "Production started. You will be notified when the summary video is ready."
  };
};
