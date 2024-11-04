<?php

/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace App\Twig\Components;

use App\Service\DinoStatsService;
use Symfony\UX\Chartjs\Builder\ChartBuilderInterface;
use Symfony\UX\Chartjs\Model\Chart;
use Symfony\UX\LiveComponent\Attribute\AsLiveComponent;
use Symfony\UX\LiveComponent\Attribute\LiveProp;
use Symfony\UX\LiveComponent\DefaultActionTrait;
use Symfony\UX\TwigComponent\Attribute\ExposeInTemplate;

#[AsLiveComponent]
class DinoChart
{
    use DefaultActionTrait;

    #[LiveProp(writable: true)]
    public array $currentTypes = ['all', 'large theropod', 'small theropod'];

    #[LiveProp(writable: true)]
    public int $fromYear = -200;

    #[LiveProp(writable: true)]
    public int $toYear = -65;

    public function __construct(
        private DinoStatsService $dinoStatsService,
        private ChartBuilderInterface $chartBuilder,
    ) {
    }

    #[ExposeInTemplate]
    public function getChart(): Chart
    {
        $chart = $this->chartBuilder->createChart(Chart::TYPE_LINE);
        $chart->setData($this->dinoStatsService->fetchData(
            $this->fromYear,
            $this->toYear,
            $this->currentTypes
        ));

        $chart->setOptions([
            // set title plugin
            'plugins' => [
                'title' => [
                    'display' => true,
                    'text' => \sprintf(
                        'Dinos species count from %dmya to %dmya',
                        abs($this->fromYear),
                        abs($this->toYear)
                    ),
                ],
                'legend' => [
                    'labels' => [
                        'boxHeight' => 20,
                        'boxWidth' => 50,
                        'padding' => 20,
                        'font' => [
                            'size' => 14,
                        ],
                    ],
                ],
            ],
            'elements' => [
                'line' => [
                    'borderWidth' => 5,
                    'tension' => 0.25,
                    'borderCapStyle' => 'round',
                    'borderJoinStyle' => 'round',
                ],
            ],
            'maintainAspectRatio' => false,
        ]);

        return $chart;
    }

    #[ExposeInTemplate]
    public function allTypes(): array
    {
        return DinoStatsService::getAllTypes();
    }
}
