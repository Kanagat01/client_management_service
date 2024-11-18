import { OrderStages, TStages } from "..";

export const findEarliestLoadStage = (
  stages: TStages[]
): OrderStages | undefined => {
  const compareDateTime = (stageA: OrderStages, stageB: OrderStages) => {
    const dateA = new Date(`${stageA.date}T${stageA.time_start}`);
    const dateB = new Date(`${stageB.date}T${stageB.time_start}`);
    return dateA.getTime() - dateB.getTime();
  };

  if (stages.length <= 0) return undefined;
  return stages.reduce((earliestStage, currentStage) => {
    if (
      !earliestStage ||
      compareDateTime(currentStage.load_stage, earliestStage.load_stage) < 0
    ) {
      return currentStage;
    }
    return earliestStage;
  }, stages[0])?.load_stage;
};

export const findLatestUnloadStage = (
  stages: TStages[]
): OrderStages | undefined => {
  const compareDateTime = (stageA: OrderStages, stageB: OrderStages) => {
    const dateA = new Date(`${stageA.date}T${stageA.time_end}`);
    const dateB = new Date(`${stageB.date}T${stageB.time_end}`);
    return dateA.getTime() - dateB.getTime();
  };

  return stages.reduce((latestStage, currentStage) => {
    if (
      !latestStage ||
      compareDateTime(currentStage.unload_stage, latestStage.unload_stage) > 0
    ) {
      return currentStage;
    }
    return latestStage;
  }, stages[0])?.unload_stage;
};
