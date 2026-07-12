import { milestones } from "../data/milestones.js";

export function getMilestone(id) {
  return milestones.find((milestone) => milestone.id === id) ?? null;
}

export function getAllMilestones() {
  return milestones;
}

export function getCompletedMilestones(completedIds = []) {
  return milestones.filter((milestone) => completedIds.includes(milestone.id));
}

export function getIncompleteMilestones(completedIds = []) {
  return milestones.filter((milestone) => !completedIds.includes(milestone.id));
}

export function getBlockedMilestones(completedIds = []) {
  return getIncompleteMilestones(completedIds).filter((milestone) =>
    milestone.requires.some((requirementId) => !completedIds.includes(requirementId))
  );
}

export function getAvailableMilestones(completedIds = []) {
  return getIncompleteMilestones(completedIds)
    .filter((milestone) =>
      milestone.requires.every((requirementId) => completedIds.includes(requirementId))
    )
    .sort((a, b) => b.priority - a.priority || a.estimatedMinutes - b.estimatedMinutes);
}

export function getNextMilestone(completedIds = []) {
  return getAvailableMilestones(completedIds)[0] ?? null;
}

export function getMissingRequirements(milestoneId, completedIds = []) {
  const milestone = getMilestone(milestoneId);
  if (!milestone) return [];
  return milestone.requires.filter((requirementId) => !completedIds.includes(requirementId));
}

export function getMilestoneProgress(milestoneId, completedIds = []) {
  const milestone = getMilestone(milestoneId);
  if (!milestone) return { done: 0, total: 0, percent: 0 };
  const dependencyIds = [...milestone.requires, milestone.id];
  const done = dependencyIds.filter((id) => completedIds.includes(id)).length;
  const total = dependencyIds.length;
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
}

export function getRecommendedMilestones(completedIds = [], limit = 3) {
  return getAvailableMilestones(completedIds)
    .filter((milestone) => milestone.groupRecommended || !milestone.optional)
    .slice(0, limit);
}

export function getUnlocksForMilestone(milestoneId) {
  const milestone = getMilestone(milestoneId);
  if (!milestone) return [];
  return milestone.unlocks.map((id) => getMilestone(id)).filter(Boolean);
}

export function explainMilestone(milestoneId, completedIds = []) {
  const milestone = getMilestone(milestoneId);
  if (!milestone) return null;
  const missing = getMissingRequirements(milestoneId, completedIds);
  return {
    milestone,
    missing,
    ready: missing.length === 0,
    progress: getMilestoneProgress(milestoneId, completedIds),
    unlocks: getUnlocksForMilestone(milestoneId)
  };
}
