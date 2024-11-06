<?php

/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Symfony\UX\Map;

use Symfony\UX\Map\Exception\InvalidArgumentException;

/**
 * Represents a polyline on a map.
 *
 * @author [Sylvain Blondeau]
 */
final readonly class Polyline
{
    /**
     * @param array<string, mixed> $extra Extra data, can be used by the developer to store additional information and use them later JavaScript side
     */
    public function __construct(
        private array $points,
        private ?string $title = null,
        private ?InfoWindow $infoWindow = null,
        private array $extra = [],
    ) {
    }

    /**
     * Convert the polyline to an array representation.
     * @return array{
     *     points: array<array{lat: float, lng: float}>,
     *     title: string|null,
     *     infoWindow: array<string, mixed>|null,
     *     extra: object,
     * }
     */
    public function toArray(): array
    {
        return [
            'points' => array_map(fn (Point $point) => $point->toArray(), $this->points),
            'title' => $this->title,
            'infoWindow' => $this->infoWindow?->toArray(),
            'extra' => (object) $this->extra,
        ];
    }

    /**
     * @param array{
     *     points: array<array{lat: float, lng: float}>,
     *     title: string|null,
     *     infoWindow: array<string, mixed>|null,
     *     extra: object,
     * } $polyline
     *
     * @internal
     */
    public static function fromArray(array $polyline): self
    {
        if (!isset($polyline['points'])) {
            throw new InvalidArgumentException('The "points" parameter is required.');
        }
        $polyline['points'] = array_map(Point::fromArray(...), $polyline['points']);

        if (isset($polyline['infoWindow'])) {
            $polyline['infoWindow'] = InfoWindow::fromArray($polyline['infoWindow']);
        }

        return new self(...$polyline);
    }
}
