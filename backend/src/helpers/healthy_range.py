from src.enums import AgeGroup
from scipy import stats, ndimage

def get_min_max_from_age_group(age_group: AgeGroup):
    if age_group == AgeGroup.Brooder:
        return 0, 5
    elif age_group == AgeGroup.Growing:
        return 6, 84
    elif age_group == AgeGroup.Prelay:
        return 85, 140
    else:
        return 141, 10000

def reference_interval(data):
    N = len(data)
    median = ndimage.median(data)
    mad = stats.median_abs_deviation(data)
    t = stats.t(df=N-1).ppf(.975)
    lower_bound = median - t*mad
    upper_bound = median + t*mad
    return lower_bound, upper_bound