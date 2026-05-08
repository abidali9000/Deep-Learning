# Waterbirds Shortcut Learning Results Summary

This file is generated after running the project scripts. Use these tables and figures in your final report/presentation.

## Test classification metrics

- Overall accuracy: **0.8393**
- Macro precision: **0.7686**
- Macro recall: **0.8124**
- Macro F1: **0.7856**
- Worst-group accuracy: **0.5950**

### Subgroup metrics

| group           |   count |   accuracy |   avg_confidence |
|:----------------|--------:|-----------:|-----------------:|
| waterbird-water |     642 |   0.933022 |         0.968616 |
| waterbird-land  |     642 |   0.595016 |         0.900816 |
| landbird-land   |    2255 |   0.985809 |         0.984344 |
| landbird-water  |    2255 |   0.735698 |         0.876226 |

## Training history

|   epoch |   train_loss |   train_acc |   val_acc |   val_worst_group_acc |   val_acc_waterbird-water |   val_acc_waterbird-land |   val_acc_landbird-land |   val_acc_landbird-water |
|--------:|-------------:|------------:|----------:|----------------------:|--------------------------:|-------------------------:|------------------------:|-------------------------:|
|       1 |   0.172916   |    0.937435 |  0.859883 |              0.323308 |                  0.789474 |                 0.323308 |                0.997859 |                 0.89485  |
|       2 |   0.059606   |    0.980813 |  0.818182 |              0.451128 |                  0.932331 |                 0.451128 |                0.993576 |                 0.714592 |
|       3 |   0.0383224  |    0.98707  |  0.801501 |              0.541353 |                  0.947368 |                 0.541353 |                0.993576 |                 0.641631 |
|       4 |   0.034049   |    0.987487 |  0.829858 |              0.56391  |                  0.947368 |                 0.56391  |                0.976445 |                 0.725322 |
|       5 |   0.0287345  |    0.991032 |  0.807339 |              0.263158 |                  0.887218 |                 0.263158 |                0.997859 |                 0.748927 |
|       6 |   0.0201795  |    0.993952 |  0.831526 |              0.421053 |                  0.932331 |                 0.421053 |                0.997859 |                 0.753219 |
|       7 |   0.0174629  |    0.995412 |  0.81151  |              0.503759 |                  0.962406 |                 0.503759 |                0.991435 |                 0.675966 |
|       8 |   0.0140484  |    0.994369 |  0.803169 |              0.428571 |                  0.917293 |                 0.428571 |                0.991435 |                 0.688841 |
|       9 |   0.00860298 |    0.997497 |  0.818182 |              0.406015 |                  0.932331 |                 0.406015 |                0.995717 |                 0.725322 |
|      10 |   0.00398068 |    0.998957 |  0.846539 |              0.398496 |                  0.864662 |                 0.398496 |                1        |                 0.815451 |
|      11 |   0.00557871 |    0.997497 |  0.835696 |              0.293233 |                  0.894737 |                 0.293233 |                1        |                 0.809013 |
|      12 |   0.00903226 |    0.997289 |  0.854045 |              0.466165 |                  0.924812 |                 0.466165 |                1        |                 0.798283 |
|      13 |   0.00620073 |    0.997706 |  0.81568  |              0.263158 |                  0.894737 |                 0.263158 |                0.997859 |                 0.76824  |
|      14 |   0.015248   |    0.995412 |  0.855713 |              0.458647 |                  0.894737 |                 0.458647 |                0.989293 |                 0.824034 |
|      15 |   0.0211876  |    0.992492 |  0.789825 |              0.165414 |                  0.879699 |                 0.165414 |                0.995717 |                 0.736052 |

## Grad-CAM group summary

| group_name      |   foreground_ratio |   background_ratio |   attention_bias_score |   correct |
|:----------------|-------------------:|-------------------:|-----------------------:|----------:|
| landbird-land   |           0.516317 |           0.483683 |               0.483683 |  0.933333 |
| landbird-water  |           0.592583 |           0.407417 |               0.407417 |  0.6      |
| waterbird-land  |           0.592562 |           0.407438 |               0.407438 |  0.7      |
| waterbird-water |           0.651988 |           0.348012 |               0.348012 |  0.966667 |

## Intervention overall metrics

| condition                |   accuracy |   prediction_flip_rate |   avg_background_ratio |
|:-------------------------|-----------:|-----------------------:|-----------------------:|
| background_blur          |      0.835 |                  0.077 |               0.330249 |
| background_mask          |      0.86  |                  0.104 |               0.278281 |
| background_patch_shuffle |      0.836 |                  0.12  |               0.405727 |
| foreground_mask          |      0.534 |                  0.318 |               0.674236 |
| original                 |      0.802 |                  0     |               0.409562 |

## Intervention subgroup metrics

| condition                | group_name      |   count |   accuracy |   avg_confidence |   avg_true_class_confidence |   prediction_flip_rate |   avg_confidence_drop |   avg_foreground_ratio |   avg_background_ratio |   avg_attention_bias_score |
|:-------------------------|:----------------|--------:|-----------:|-----------------:|----------------------------:|-----------------------:|----------------------:|-----------------------:|-----------------------:|---------------------------:|
| background_blur          | landbird-land   |     352 |  0.977273  |         0.964965 |                    0.952885 |              0.0113636 |           0.0189209   |               0.619102 |               0.380898 |                   0.380898 |
| background_blur          | landbird-water  |     383 |  0.791123  |         0.873389 |                    0.751492 |              0.127937  |          -0.0121376   |               0.713193 |               0.286807 |                   0.286807 |
| background_blur          | waterbird-land  |     139 |  0.532374  |         0.899329 |                    0.536121 |              0.115108  |           0.00585894  |               0.649155 |               0.350845 |                   0.350845 |
| background_blur          | waterbird-water |     126 |  0.904762  |         0.934734 |                    0.873584 |              0.0634921 |           0.0199228   |               0.701915 |               0.298085 |                   0.298085 |
| background_mask          | landbird-land   |     352 |  0.96875   |         0.953855 |                    0.937461 |              0.0142045 |           0.0300304   |               0.711898 |               0.288102 |                   0.288102 |
| background_mask          | landbird-water  |     383 |  0.861619  |         0.904876 |                    0.822701 |              0.177546  |          -0.0436249   |               0.722787 |               0.277213 |                   0.277213 |
| background_mask          | waterbird-land  |     139 |  0.597122  |         0.90497  |                    0.592748 |              0.122302  |           0.000218573 |               0.732153 |               0.267847 |                   0.267847 |
| background_mask          | waterbird-water |     126 |  0.84127   |         0.913563 |                    0.825012 |              0.111111  |           0.0410935   |               0.734401 |               0.265599 |                   0.265599 |
| background_patch_shuffle | landbird-land   |     352 |  0.982955  |         0.97428  |                    0.963306 |              0.0170455 |           0.00960611  |               0.570579 |               0.429421 |                   0.429421 |
| background_patch_shuffle | landbird-water  |     383 |  0.835509  |         0.894423 |                    0.796337 |              0.198433  |          -0.0331714   |               0.612473 |               0.387527 |                   0.387527 |
| background_patch_shuffle | waterbird-land  |     139 |  0.489209  |         0.894282 |                    0.4802   |              0.158273  |           0.0109059   |               0.588206 |               0.411794 |                   0.411794 |
| background_patch_shuffle | waterbird-water |     126 |  0.809524  |         0.876734 |                    0.771961 |              0.126984  |           0.0779231   |               0.611838 |               0.388162 |                   0.388162 |
| foreground_mask          | landbird-land   |     352 |  0.971591  |         0.943984 |                    0.932732 |              0.0397727 |           0.0399015   |               0.349003 |               0.650997 |                   0.650997 |
| foreground_mask          | landbird-water  |     383 |  0.206266  |         0.801448 |                    0.292028 |              0.556136  |           0.0598036   |               0.298351 |               0.701649 |                   0.701649 |
| foreground_mask          | waterbird-land  |     139 |  0.0719424 |         0.920145 |                    0.108053 |              0.47482   |          -0.0149563   |               0.338363 |               0.661637 |                   0.661637 |
| foreground_mask          | waterbird-water |     126 |  0.81746   |         0.844255 |                    0.757378 |              0.198413  |           0.110401    |               0.330267 |               0.669733 |                   0.669733 |
| original                 | landbird-land   |     352 |  0.982955  |         0.983886 |                    0.971031 |              0         |           0           |               0.546428 |               0.453572 |                   0.453572 |
| original                 | landbird-water  |     383 |  0.699739  |         0.861251 |                    0.666087 |              0         |           0           |               0.635725 |               0.364275 |                   0.364275 |
| original                 | waterbird-land  |     139 |  0.503597  |         0.905188 |                    0.513552 |              0         |           0           |               0.553236 |               0.446764 |                   0.446764 |
| original                 | waterbird-water |     126 |  0.936508  |         0.954657 |                    0.922763 |              0         |           0           |               0.616769 |               0.383231 |                   0.383231 |

## Figures to include

- `outputs/figures/test_confusion_matrix.png`
- `outputs/figures/intervention_accuracy.png`
- `outputs/figures/intervention_background_saliency.png`
- representative images from `outputs/gradcam/`

## Suggested discussion points

1. Compare overall accuracy with worst-group accuracy.
2. Identify which subgroup is weakest: usually one of the shortcut-conflict groups.
3. Discuss whether Grad-CAM attention is more concentrated inside the center foreground or outside in the background.
4. Compare original performance with background-blur/background-mask performance.
5. Compare original performance with foreground-mask performance.
6. Use prediction flip rate and confidence drop to support your conclusion about shortcut learning.
