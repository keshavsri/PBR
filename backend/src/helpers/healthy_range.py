from src.enums import AgeGroup, HealthyRangeMethod
from scipy import stats
import statistics
import math

def get_min_max_from_age_group(age_group: AgeGroup):
    if age_group == AgeGroup.Brooder:
        return 0, 5
    elif age_group == AgeGroup.Growing:
        return 6, 84
    elif age_group == AgeGroup.Prelay:
        return 85, 140
    else:
        return 141, 10000

def reference_interval(data, method: HealthyRangeMethod):
    if method == HealthyRangeMethod.Standard:
        N = len(data)
        mean = statistics.mean(data)
        std = statistics.stdev(data)
        t = stats.t(df=N-1).ppf(.975)
        lower_bound = mean - t*std*math.sqrt((N+1)/N)
        upper_bound = mean + t*std*math.sqrt((N+1)/N)
        return lower_bound, upper_bound
